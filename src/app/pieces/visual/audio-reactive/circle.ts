import { SketchProps } from "canvas-sketch";
import { CanvasSketchSettingsFunc } from "../../../components/Canvas";
import { VisualPiece } from "../../registry";

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
    console.log({ analyser });

    if (analyser && !audioData) {
      createAudio(analyser);
    }

    return ({ context }: SketchProps) => {
      context.fillStyle = "white";
      context.fillRect(0, 0, width, height);

      if (analyser && audioData) {
        analyser.getFloatFrequencyData(audioData);

        const avg = getAverage(audioData);

        context.save();
        context.translate(width * 0.5, height * 0.5);
        context.lineWidth = 10;

        console.log(Math.abs(avg));

        context.beginPath();
        context.arc(0, 0, Math.abs(avg), 0, Math.PI * 2);
        context.stroke();

        context.restore();
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
  audioData = new Float32Array(analyser.frequencyBinCount);
};

const getAverage = (data: Float32Array) => {
  let sum = 0;
  for (let i = 0; i < data.length; i++) {
    sum += data[i];
  }
  const avg = sum / data.length;

  return avg;

  // // Normalize the average to a positive range
  // const normalizedAvg = avg + 130; // Assuming -130 is the minimum dB value
  // return normalizedAvg;
};

export default visualPiece;
