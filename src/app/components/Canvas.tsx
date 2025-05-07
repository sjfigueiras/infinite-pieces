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

export type CanvasSketchManager = {
  play: () => void;
  stop: () => void;
  pause: () => void;
  resume: () => void;
  setTime: (time: number) => void;
  getTime: () => number;
  getDuration: () => number;
};

export type CanvasSketchSettingsFunc = (
  analyser?: AnalyserNode,
  canvas?: HTMLCanvasElement,
) => CanvasSketchSettings;

export interface CanvasProps extends VisualPiece {
  analyser?: AnalyserNode;
  onPause: () => void;
  onPlay: () => void;
  setManager: (manager: CanvasSketchManager) => void;
}

const Canvas = ({ analyser, settings, sketch, setManager }: CanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const setupCanvas = async () => {
        const manager = await canvasSketch(sketch(analyser), {
          ...settings(analyser, canvasRef.current!),
          canvas: canvasRef.current!,
        });
        setManager(manager);
      };
      setupCanvas();
    }
  }, [settings, sketch, analyser, setManager]);

  return (
    <section>
      <canvas ref={canvasRef}></canvas>
    </section>
  );
};

export default Canvas;
