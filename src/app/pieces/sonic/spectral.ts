import * as Tone from "tone";
import { SonicPiece } from "../registry";

// Create a bank of oscillators for spectral synthesis
// Using a combination of fundamental frequencies and their harmonics
const oscillators = [
  // Bass frequencies (fundamental and sub-harmonics)
  new Tone.Oscillator({ frequency: 55, type: "sine" }), // A1
  new Tone.Oscillator({ frequency: 110, type: "sine" }), // A2
  new Tone.Oscillator({ frequency: 220, type: "sine" }), // A3
  new Tone.Oscillator({ frequency: 440, type: "sine" }), // A4

  // Additional harmonics and overtones
  new Tone.Oscillator({ frequency: 330, type: "sine" }), // E4
  new Tone.Oscillator({ frequency: 660, type: "sine" }), // E5
  new Tone.Oscillator({ frequency: 880, type: "sine" }), // A5
  new Tone.Oscillator({ frequency: 1320, type: "sine" }), // E6

  // Higher harmonics for texture
  new Tone.Oscillator({ frequency: 1760, type: "sine" }), // A6
  new Tone.Oscillator({ frequency: 2200, type: "sine" }), // C#7
  new Tone.Oscillator({ frequency: 2640, type: "sine" }), // E7
  new Tone.Oscillator({ frequency: 3520, type: "sine" }), // A7
];

// Create modulation sources with varying rates
const amplitudeLFOs = oscillators.map((_, i) => {
  // Create slower LFOs for lower frequencies and faster for higher ones
  const baseRate = 0.1 + i * 0.05;
  return new Tone.LFO(baseRate, 0, 1);
});

// Create effects
const reverb = new Tone.Reverb({
  decay: 6,
  wet: 0.5,
}).toDestination();

const delay = new Tone.FeedbackDelay({
  delayTime: "8n",
  feedback: 0.4,
  wet: 0.3,
}).connect(reverb);

// Add a filter for spectral shaping
const filter = new Tone.Filter({
  frequency: 2000,
  type: "lowpass",
  rolloff: -24,
}).connect(delay);

// Connect everything
oscillators.forEach((osc, i) => {
  const gain = new Tone.Gain(0);
  // Adjust gain based on frequency (lower gain for higher frequencies)
  gain.gain.value = 1 / (1 + i * 0.1);
  amplitudeLFOs[i].connect(gain.gain);
  osc.chain(gain, filter);
  osc.start();
});

// Create a sequence to modulate the spectral content
const seq = new Tone.Sequence(
  (time) => {
    amplitudeLFOs.forEach((lfo, i) => {
      // Create more complex modulation patterns
      const baseFreq = 0.1 + i * 0.05;
      const modFreq = baseFreq * (1 + Math.sin(time * 0.1));
      lfo.frequency.value = modFreq;
    });
  },
  [0, 1, 2, 3, 4, 5, 6, 7],
  "upDown",
);

// Start the sequence and LFOs
Tone.Transport.bpm.value = 60;
seq.start(0);
amplitudeLFOs.forEach((lfo) => lfo.start());

const sonicPiece: SonicPiece = {
  author: "Santiago Figueiras",
  tags: ["spectral", "synthesis", "experimental", "ai-generated", "drone"],
  title: "Spectral Synthesis",
};

export default sonicPiece;
