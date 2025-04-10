"use client";
import { useEffect, useRef } from "react";
import canvasSketch from "canvas-sketch";
import { VisualPiece } from "../pieces/registry";

export type CanvasSketchSettings = (canvas: HTMLCanvasElement) => object;

const Canvas = (props: VisualPiece) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (canvasRef.current) {
      canvasSketch(props.sketch, {
        ...props.settings(canvasRef.current),
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

export default Canvas;
