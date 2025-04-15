"use client";
import { useEffect, useRef } from "react";
import canvasSketch from "canvas-sketch";
import { VisualPiece } from "../pieces/registry";

export interface CanvasSketchSettings {
  animate?: boolean;
  canvas?: HTMLCanvasElement;
  context?: CanvasRenderingContext2D;
  dimensions?: [number, number];
  duration?: number;
  durationInFrames?: number;
  fps?: number;
  pixelsPerInch?: number;
  playbackRate?: number;
  scaleToView?: boolean;
}

export type CanvasSketchSettingsFunc = 
  (canvas?: HTMLCanvasElement, audioComponent?: HTMLAudioElement) => CanvasSketchSettings;

export interface CanvasProps extends VisualPiece {
  audioComponent?: HTMLAudioElement;
}

const Canvas = (props: CanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (canvasRef.current) {
      canvasSketch(props.sketch(props.audioComponent), {
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
