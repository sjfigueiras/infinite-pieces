import * as Tone from "tone";
import { SonicPiece } from "../registry";

// Create a buffer source for granular processing
const buffer = new Tone.Buffer();

// Create a granular player
const grainPlayer = new Tone.GrainPlayer().toDestination();

// Create LFOs for modulation
const grainSizeLFO = new Tone.LFO({
  frequency: 0.1,
  min: 0.01,
  max: 0.2,
}).start();

const overlapLFO = new Tone.LFO({
  frequency: 0.05,
  min: 0.1,
  max: 0.5,
}).start();

const rateLFO = new Tone.LFO({
  frequency: 0.02,
  min: 0.5,
  max: 2,
}).start();

// Create a reverb for space
const reverb = new Tone.Reverb({
  decay: 4,
  wet: 0.4,
}).toDestination();

// Create a delay for texture
const delay = new Tone.FeedbackDelay({
  delayTime: "8n",
  feedback: 0.3,
  wet: 0.2,
}).connect(reverb);

// Connect the grain player to effects
grainPlayer.connect(delay);

// Create a sequence to modulate parameters
const seq = new Tone.Sequence(
  (time, value) => {
    grainPlayer.grainSize = value;
    grainPlayer.overlap = value * 2;
    grainPlayer.playbackRate = value * 2;
  },
  [0.05, 0.1, 0.15, 0.2, 0.15, 0.1, 0.05, 0.02],
  "upDown",
);

// Function to trigger a granular burst
const triggerGranularBurst = (time: number) => {
  // Randomize parameters for each burst
  grainPlayer.grainSize = Math.random() * 0.2 + 0.01;
  grainPlayer.overlap = Math.random() * 0.4 + 0.1;
  grainPlayer.playbackRate = Math.random() * 1.5 + 0.5;

  // Start the grain player
  grainPlayer.start(time);

  // Stop after a random duration
  const duration = Math.random() * 2 + 1;
  grainPlayer.stop(time + duration);
};

// Schedule random granular bursts
const scheduleRandomBursts = () => {
  // Schedule the next burst
  const nextTime = Tone.now() + Math.random() * 4 + 2; // Random time between 2-6 seconds
  triggerGranularBurst(nextTime);

  // Schedule the next burst
  Tone.Transport.scheduleOnce(() => {
    scheduleRandomBursts();
  }, nextTime);
};

// Start everything with proper timing
const now = Tone.now();
seq.start(now);

// Load and start the buffer
buffer.load("https://tonejs.github.io/audio/berklee/gong_1.mp3").then(() => {
  grainPlayer.buffer = buffer;
  // Start the random bursts
  scheduleRandomBursts();
});

const sonicPiece: SonicPiece = {
  author: "Santiago Figueiras",
  tags: ["granular", "texture", "experimental", "ambient"],
  title: "Granular Texture",
};

export default sonicPiece;
