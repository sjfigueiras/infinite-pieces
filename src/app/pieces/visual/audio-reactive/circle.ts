import { SketchProps } from "canvas-sketch";
import { CanvasSketchSettingsFunc } from "../../../components/Canvas";
import { VisualPiece } from "../../registry";
import math from "canvas-sketch-util/math";

export const settings: CanvasSketchSettingsFunc = (_canvas, analyser) => ({
  analyser,
  animate: true,
  pixelsPerInch: 300,
  scaleToView: true,
});

let audioData: Float32Array | null = null;

export const sketch: VisualPiece["sketch"] =
  (analyser) =>
  ({ width, height }) => {
    const bins = [4, 3, 6, 12, 19];

    if (analyser && !audioData) {
      createAudio(analyser);
    }

    return ({ context }: SketchProps) => {
      context.fillStyle = "white";
      context.fillRect(0, 0, width, height);

      if (analyser && audioData) {
        analyser.getFloatFrequencyData(audioData);

        for (let i = 0; i < bins.length; i++) {
          const bin = bins[i];
          const mapped = math.mapRange(
            audioData[bin],
            analyser.minDecibels,
            analyser.maxDecibels,
            0,
            1,
            true,
          );
          const radius = mapped * 300;

          context.save();
          context.translate(width * 0.5, height * 0.5);
          context.lineWidth = 10;

          context.beginPath();
          context.arc(0, 0, radius, 0, Math.PI * 2);
          context.stroke();

          context.restore();
        }

        // const avg = getAverage(audioData);
      }
    };
  };

const visualPiece: VisualPiece = {
  author: "Santiago Figueiras",
  tags: ["circle", "audio-reactive", "examples", "starters"],
  title: "Circle",
  settings,
  sketch,
};

const createAudio = (analyser: AnalyserNode) => {
  analyser.fftSize = 256;
  analyser.smoothingTimeConstant = 0.95;
  audioData = new Float32Array(analyser.frequencyBinCount);
};

export default visualPiece;
