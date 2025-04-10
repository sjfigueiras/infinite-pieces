import risoColors from "riso-colors";
import random from "canvas-sketch-util/random";
import Color from "canvas-sketch-util/color";
import math from "canvas-sketch-util/math";
import { SketchProps } from "canvas-sketch";
import { CanvasSketchSettings } from "../../components/Canvas";

interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
  fill: string;
  stroke: string;
}

const seed = random.getRandomSeed();

export const settings: CanvasSketchSettings = (canvas) => ({
  canvas: canvas,
  pixelsPerInch: 300,
  scaleToView: true,
  units: "in",
  name: seed,
});

/**
 * TODO: Make the Modulator values available to the Sketch.
 */
export const sketch = ({ context, width, height }: SketchProps) => {
  random.setSeed(seed);

  const num = 30;
  const rects: Rect[] = [];

  const rectColors = [random.pick(risoColors), random.pick(risoColors)];

  const bgColor = random.pick(risoColors).hex;

  const mask = {
    radius: height * 0.3,
    sides: 3,
    x: width * 0.5,
    y: height * 0.55,
  };

  for (let i = 0; i < num; i++) {
    const x = random.range(0, width);
    const y = random.range(0, height * 0.5);
    const w = random.range(600, width * 0.5);
    const h = random.range(40, 200);

    const fill = random.pick(rectColors).hex;
    const stroke = random.pick(rectColors).hex;

    rects.push({ x, y, w, h, fill, stroke });
  }

  context.restore();

  const drawSkewedRect = ({
    context,
    w = 600,
    h = 200,
    degrees = 45,
  }: {
    context: CanvasRenderingContext2D;
    w?: number;
    h?: number;
    degrees?: number;
  }) => {
    const angle = math.degToRad(degrees);

    const rx = Math.cos(angle) * w;
    const ry = Math.sin(angle) * w;

    context.save();
    context.translate(rx * -0.5, (ry + h) * -0.5);

    context.beginPath();
    context.moveTo(0, 0);
    context.lineTo(rx, ry);
    context.lineTo(rx, ry + h);
    context.lineTo(0, h);
    context.closePath();
    context.stroke();

    context.restore();
  };

  const drawPolygon = ({
    context,
    radius,
    sides = 3,
  }: {
    context: CanvasRenderingContext2D;
    radius: number;
    sides: number;
  }) => {
    const slice = (Math.PI * 2) / sides;

    context.beginPath();
    context.moveTo(0, -radius);

    for (let i = 1; i < sides; i++) {
      const theta = i * slice - Math.PI * 0.5;
      context.lineTo(Math.cos(theta) * radius, Math.sin(theta) * radius);
    }

    context.closePath();
  };

  return ({ context }: SketchProps) => {
    context.fillStyle = bgColor;
    context.fillRect(0, 0, width, height);

    context.save();
    context.translate(mask.x, mask.y);

    drawPolygon({ context, radius: mask.radius, sides: mask.sides });

    context.clip();

    rects.forEach((rect) => {
      const { x, y, w, h, fill, stroke } = rect;

      context.strokeStyle = stroke;
      context.fillStyle = fill;
      context.lineWidth = 10;

      context.save();
      context.translate(-mask.x, -mask.y);
      context.translate(x, y);

      const blend = random.value() > 0.5 ? "overlay" : "source-over";
      context.globalCompositeOperation = blend;

      drawSkewedRect({ context, w, h });

      const shadowColor = Color.offsetHSL(stroke, 0, 0, -20);
      shadowColor.rgba[3] = 0.5;

      context.shadowOffsetX = -10;
      context.shadowOffsetY = 20;
      context.shadowColor = Color.style(shadowColor.rgba);
      context.fill();
      context.stroke();

      context.globalCompositeOperation = blend;

      context.restore();
    });

    context.restore();

    context.save();
    context.translate(mask.x, mask.y);

    context.lineWidth = 20;
    drawPolygon({
      context,
      radius: mask.radius - context.lineWidth,
      sides: mask.sides,
    });

    context.globalCompositeOperation = "color-burn";
    context.strokeStyle = rectColors[0].hex;
    context.stroke();

    context.restore();
  };
};

const visualPiece = {
  title: "Skewed Rects",
  settings,
  sketch,
};

export default visualPiece;
