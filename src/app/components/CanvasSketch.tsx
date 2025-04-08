"use client";
import { useEffect, useRef } from "react";
import canvasSketch from "canvas-sketch";

/**
 * TODO:
 *  - Make a sketch registry analogous to the piece registry.
 *  - Make a modulator abstraction to distribute LFOs both to
 * the sketches and the pieces.
 */
import { settings, sketch } from "./sketches/skewed-rects";

export type CanvasSketchSettings = (canvas: HTMLCanvasElement) => object;

const CanvasSketch = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (canvasRef.current) {
      canvasSketch(sketch, {
        ...settings(canvasRef.current),
        canvas: canvasRef.current,
      });
    }
  });

  return (
    <section>
      <canvas ref={canvasRef}></canvas>
    </section>
  );
};

export default CanvasSketch;
