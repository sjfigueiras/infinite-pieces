"use client";
import { SketchProps } from "canvas-sketch";
import { CanvasSketchSettingsFunc } from "../../components/Canvas";
import { VisualPiece } from "../registry";

export const settings: CanvasSketchSettingsFunc = (
  _audioComponent,
  canvas,
) => ({
  animate: true,
  canvas,
  pixelsPerInch: 300,
  scaleToView: true,
  units: "in",
});

/**
 * TODO: Make the Modulator/AnalyserNode available to the Sketch.
 */
export const sketch = () => () => {
  return ({ context, width, height }: SketchProps) => {
    // Margin in inches
    const margin = 1 / 4;

    // Obtén el valor actual del LFO desde el Signal

    // Usa el valor del LFO en el sketch
    const x = (1 / 2) * width; // Mapea el valor del LFO (-1 a 1) al ancho del canvas
    const y = (1 / 2) * height; // Mapea el valor del LFO a la altura del canvas

    // Off-white background
    context.fillStyle = "hsl(0, 0%, 98%)";
    context.fillRect(0, 0, width, height);

    // Gradient foreground
    const fill = context.createLinearGradient(0, 0, width, height);
    fill.addColorStop(0, "cyan");
    fill.addColorStop(1, "orange");

    // Fill rectangle
    context.fillStyle = fill;
    context.fillRect(margin, margin, width - margin * 2, height - margin * 2);

    // Dibuja un círculo basado en el valor del LFO
    context.beginPath();
    context.arc(x, y, 10, 0, Math.PI * 2);
    context.fillStyle = "black";
    context.fill();
  };
};

const visualPiece: VisualPiece = {
  author: "Santiago Figueiras",
  title: "Nro. 1",
  settings,
  sketch,
};

export default visualPiece;
