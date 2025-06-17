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

// Create filters for timbre variation
const lowFilter = new Tone.Filter(200, "lowpass").toDestination();
const highFilter = new Tone.Filter(2000, "highpass").toDestination();
const bandFilter = new Tone.Filter(1000, "bandpass").toDestination();

// Create a reverb for space with longer decay
const reverb = new Tone.Reverb({
  decay: 8,
  wet: 0.6,
}).toDestination();

// Create a delay for texture
const delay = new Tone.FeedbackDelay({
  delayTime: "8n",
  feedback: 0.4,
  wet: 0.3,
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
  // Randomize parameters for each burst with wider ranges
  grainPlayer.grainSize = Math.random() * 0.4 + 0.01; // 0.01 to 0.41
  grainPlayer.overlap = Math.random() * 0.8 + 0.1; // 0.1 to 0.9
  grainPlayer.playbackRate = Math.random() * 3 + 0.25; // 0.25 to 3.25

  // Randomly choose a filter configuration
  const filterChoice = Math.floor(Math.random() * 3);
  switch (filterChoice) {
    case 0:
      grainPlayer.disconnect();
      grainPlayer.connect(lowFilter);
      lowFilter.frequency.value = Math.random() * 1000 + 100; // 100 to 1100 Hz
      break;
    case 1:
      grainPlayer.disconnect();
      grainPlayer.connect(highFilter);
      highFilter.frequency.value = Math.random() * 3000 + 500; // 500 to 3500 Hz
      break;
    case 2:
      grainPlayer.disconnect();
      grainPlayer.connect(bandFilter);
      bandFilter.frequency.value = Math.random() * 2000 + 500; // 500 to 2500 Hz
      bandFilter.Q.value = Math.random() * 10 + 2; // Q: 2 to 12
      break;
  }

  // Start the grain player
  grainPlayer.start(time);

  // Stop after a random duration
  const duration = Math.random() * 2 + 2;
  grainPlayer.stop(time + duration);
};

// Schedule random granular bursts
const scheduleRandomBursts = () => {
  // Schedule the next burst with shorter intervals for more overlap
  const nextTime = Tone.now() + Math.random() * 2 + 1; // Random time between 1-3 seconds
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
