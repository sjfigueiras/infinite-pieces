'use client';
import { Piece } from "../pieces/types";
import { useEffect, useRef } from "react";
import canvasSketch from 'canvas-sketch';

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
    
    interface SketchContext {
        context: any;
        width: number;
        height: number;
        playhead: number;
    }

    useEffect(() => {
        if (canvasRef.current) {
            canvasSketch(sketch, { ...settings, canvas: canvasRef.current });
        }
    }, []);

    const sketch = () => {
        return ({ context, width, height, playhead  }: SketchContext) => {
            // Margin in inches
            const margin = 1 / 4;

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
        };
    };

    // canvasSketch(sketch, settings);

    return (
        <section>
            <canvas ref={canvasRef}></canvas>
        </section>
    );
}

export default None;