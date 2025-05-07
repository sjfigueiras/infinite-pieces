import { CanvasSketchSettingsFunc } from "../../components/Canvas";
import { lerp } from "canvas-sketch-util/math";
import { VisualPiece } from "../registry";
import { SketchProps } from "canvas-sketch";

export const settings: CanvasSketchSettingsFunc = () => ({
  duration: 3,
  scaleToView: true,
  animate: true,
});

// Start the sketch
export const sketch: VisualPiece["sketch"] = () => () => {
  return ({ context, width, height, playhead }: SketchProps) => {
    context.clearRect(0, 0, width, height);
    context.fillStyle = "white";
    context.fillRect(0, 0, width, height);

    const gridSize = 7;
    const padding = width * 0.2;
    const tileSize = (width - padding * 2) / gridSize;

    for (let x = 0; x < gridSize; x++) {
      for (let y = 0; y < gridSize; y++) {
        // get a 0..1 UV coordinate
        const u = gridSize <= 1 ? 0.5 : x / (gridSize - 1);
        const v = gridSize <= 1 ? 0.5 : y / (gridSize - 1);

        // scale to dimensions with a border padding
        const tx = lerp(padding, width - padding, u);
        const ty = lerp(padding, height - padding, v);

        // here we get a 't' value between 0..1 that
        // shifts subtly across the UV coordinates
        const offset = u * 0.2 + v * 0.1;
        const t = (playhead + offset) % 1;

        // now we get a value that varies from 0..1 and back
        let mod = Math.sin(t * Math.PI);

        // we make it 'ease' a bit more dramatically with exponential
        mod = Math.pow(mod, 3);

        // now choose a length, thickness and initial rotation
        const length = tileSize * 0.65;
        const thickness = tileSize * 0.1;
        const initialRotation = Math.PI / 2;

        // And rotate each line a bit by our modifier
        const rotation = initialRotation + mod * Math.PI;

        // Now render...
        draw({ context, x: tx, y: ty, length, thickness, rotation });
      }
    }
  };

  interface DrawParams {
    context: CanvasRenderingContext2D;
    x: number;
    y: number;
    length: number;
    thickness: number;
    rotation: number;
  }

  function draw({
    context,
    x,
    y,
    length,
    thickness,
    rotation,
  }: DrawParams): void {
    context.save();
    context.fillStyle = "black";

    // Rotate in place
    context.translate(x, y);
    context.rotate(rotation);
    context.translate(-x, -y);

    // Draw the line
    context.fillRect(x - length / 2, y - thickness / 2, length, thickness);
    context.restore();
  }
};

const visualPiece: VisualPiece = {
  author: "Matt DesLauriers",
  settings,
  sketch,
  tags: ["grid", "lines", "animated", "starter"],
  title: "Animated Grid",
};

export default visualPiece;
