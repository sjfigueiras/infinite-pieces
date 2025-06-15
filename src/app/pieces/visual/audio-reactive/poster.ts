import { SketchProps } from "canvas-sketch";
import { CanvasSketchSettingsFunc } from "../../../components/Canvas";
import { VisualPiece } from "../../registry";
import math from "canvas-sketch-util/math";
import random from "canvas-sketch-util/random";

import eases from "eases";

export const settings: CanvasSketchSettingsFunc = (_canvas, analyser) => ({
  analyser,
  animate: true,
  pixelsPerInch: 300,
  scaleToView: true,
});

let audioData: Float32Array | null = null;
let minDb: number, maxDb: number;

export const sketch: VisualPiece["sketch"] =
  (analyser) =>
  ({ width, height }) => {
    const numCircles = 5;
    const numSlices = 9;
    const slice = (Math.PI * 2) / numSlices;
    const radius = 200;

    const bins: number[] = [];

    const lineWidths: number[] = [];

    let lineWidth: number, bin, mapped;

    for (let i = 0; i < numCircles * numSlices; i++) {
      bin = random.rangeFloor(4, 20);
      if (random.value() > 0.5) bin = 0;
      bins.push(bin);
    }

    for (let i = 0; i < numCircles; i++) {
      const t = i / (numCircles - 1);
      lineWidth = eases.quadIn(t) * 200 + 20;
      lineWidths.push(lineWidth);
    }

    if (analyser && !audioData) {
      createAudio(analyser);
    }

    return ({ context }: SketchProps) => {
      context.fillStyle = "#EEEAE0";
      context.fillRect(0, 0, width, height);

      let cradius = radius;

      if (analyser && audioData) {
        analyser.getFloatFrequencyData(audioData);

        context.save();
        context.translate(width * 0.5, height * 0.5);

        for (let i = 0; i < numCircles; i++) {
          context.save();
          for (let j = 0; j < numSlices; j++) {
            context.rotate(slice);
            context.lineWidth = lineWidths[i];

            bin = bins[i * numSlices + j];
            if (!bin) continue;

            mapped = math.mapRange(audioData[bin], minDb, maxDb, 0, 1, true);

            lineWidth = lineWidths[i] * mapped;
            if (lineWidth < 1) continue;

            context.lineWidth = lineWidth;

            context.beginPath();
            context.arc(0, 0, cradius + context.lineWidth * 0.5, 0, slice);
            context.stroke();
          }

          cradius += lineWidths[i];

          context.restore();
        }

        context.restore();
      }
    };
  };

const createAudio = (analyser: AnalyserNode) => {
  analyser.fftSize = 1024;
  analyser.smoothingTimeConstant = 0.95;
  minDb = analyser.minDecibels;
  maxDb = analyser.maxDecibels;
  audioData = new Float32Array(analyser.frequencyBinCount);
};

const visualPiece: VisualPiece = {
  author: "Santiago Figueiras",
  tags: ["circle", "audio-reactive", "examples", "starters"],
  title: "Circle",
  settings,
  sketch,
};

export default visualPiece;
