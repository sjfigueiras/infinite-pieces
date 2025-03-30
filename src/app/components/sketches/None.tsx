'use client';
import { Piece } from "../pieces/types";
import { useEffect, useRef } from "react";
import canvasSketch, { SketchProps } from 'canvas-sketch';
import * as Tone from 'tone';

export interface NoneProps {
    piece?: Piece;
}

const None = ({piece}: {piece?: Piece}) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    const settings = {
        // dimensions: 'a4',
        animate: true,
        canvas: canvasRef.current,
        pixelsPerInch: 300,
        scaleToView: true,
        units: 'in',
    };

    useEffect(() => {
        if (canvasRef.current) {
            canvasSketch(sketch, { ...settings, canvas: canvasRef.current });
        }
    }, []);

    const modulators = piece?.modulators;
    const signal = modulators?.[0]?.signal;
    console.log({signal});

    /**
     * TODO: Make the Modulator values available to the Sketch.
     */
    const sketch = () => {

        return ({ context, width, height, time  }: SketchProps) => {
            // Margin in inches
            const margin = 1 / 4;

            // Obtén el valor actual del LFO desde el Signal
            const lfoValue = signal?.value || 0;
            console.log(lfoValue);

            // Usa el valor del LFO en el sketch
            const x = (lfoValue + 1) / 2 * width; // Mapea el valor del LFO (-1 a 1) al ancho del canvas
            const y = (1 - (lfoValue + 1) / 2) * height; // Mapea el valor del LFO a la altura del canvas

            // Off-white background
            context.fillStyle = 'hsl(0, 0%, 98%)';
            context.fillRect(0, 0, width, height);

            // Gradient foreground
            const fill = context.createLinearGradient(0, 0, width, height);
            fill.addColorStop(0, 'cyan');
            fill.addColorStop(1, 'orange');

            // Fill rectangle
            context.fillStyle = fill;
            context.fillRect(margin, margin, width - margin * 2, height - margin * 2);

            // Dibuja un círculo basado en el valor del LFO
            context.beginPath();
            context.arc(x, y, 10, 0, Math.PI * 2);
            context.fillStyle = 'black';
            context.fill();
        };
    };

    return (
        <section>
            <canvas ref={canvasRef}></canvas>
        </section>
    );
}

export default None;