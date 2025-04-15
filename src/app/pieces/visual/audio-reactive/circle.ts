import { SketchProps } from "canvas-sketch";
import { CanvasSketchSettingsFunc } from "../../../components/Canvas";
import { VisualPiece } from "../../registry";

export const settings: CanvasSketchSettingsFunc = (_canvas, audioComponent) => ({
  animate: true,
  audioComponent,
  pixelsPerInch: 300,
  scaleToView: true,
});

let audioContext: AudioContext | null = null;
let audioData: Float32Array | null = null;
let analyser: AnalyserNode | null = null;

let manager;

export const sketch: VisualPiece["sketch"] = (audioComponent) => ({ width, height }) => {
  console.log({audioComponent});

  // TODO: maybe we don't need the user interaction given they will
  // interact in the first place with the player.
  window.addEventListener("mouseup", () => {
    if (!audioContext) {
      if (audioComponent) {
        createAudio(audioComponent as HTMLAudioElement);
      } else {
        console.error("Audio element not found");
      }
    }
  });

  return ({ context }: SketchProps) => {
    context.fillStyle = "white";
    context.fillRect(0, 0, width, height);
    
    if (audioContext && analyser && audioData) {
      analyser.getFloatFrequencyData(audioData);

      const avg = getAverage(audioData!);

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

const createAudio = (audioElement: HTMLAudioElement) => {
  if (!audioContext) {
    audioContext = new AudioContext();
    const source = audioContext.createMediaElementSource(audioElement);

    analyser = audioContext.createAnalyser();
    analyser.fftSize = 1024; // Adjust FFT size as needed

    audioData = new Float32Array(analyser.frequencyBinCount);
    source.connect(analyser);
    analyser.connect(audioContext.destination);
    console.log("Audio context and analyser created");
  }
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
}

export default visualPiece;
