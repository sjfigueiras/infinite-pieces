import * as Tone from "tone";
import { SonicPiece } from "../registry";

// Create noise sources
const noise = new Tone.Noise("pink").start();
const noise2 = new Tone.Noise("white").start();

// Create a sub-oscillator for thunder
const subOsc = new Tone.Oscillator({
  type: "sine",
  frequency: 20,
}).start();

// Create modulation sources
const filterLFO = new Tone.LFO("0.01hz", 200, 2000);
const filterLFO2 = new Tone.LFO("0.015hz", 1000, 4000);
const panLFO = new Tone.LFO("0.05hz", -0.3, 0.3);

// Create LFO to modulate filter LFO frequencies
const filterRateLFO = new Tone.LFO({
  frequency: 0.02, // Very slow modulation of the filter rates
  min: 0.01, // Will multiply the base frequencies by 0.5 (slower)
  max: 0.08, // Will multiply the base frequencies by 1.5 (faster)
}).start();

// Create thunder modulation
const thunderLFO = new Tone.LFO({
  frequency: 0.01, // Very slow modulation for occasional thunder
  min: -60,
  max: -20,
}).connect(subOsc.volume);

// Create distortion modulation
const distortionLFO = new Tone.LFO({
  frequency: 0.005, // Very slow modulation for occasional distortion
  min: 0,
  max: 0.3,
}).start();

// Create filters
const filter = new Tone.Filter(1000, "lowpass");
const filter2 = new Tone.Filter(2000, "highpass");
const subFilter = new Tone.Filter(60, "lowpass"); // Very low filter for thunder
filterLFO.connect(filter.frequency);
filterLFO2.connect(filter2.frequency);

// Create pan
const pan = new Tone.Panner();
panLFO.connect(pan.pan);

// Create effects
const reverb = new Tone.Reverb({
  decay: 8, // Longer decay for thunder
  wet: 0.6, // More reverb
}).toDestination();

const delay = new Tone.FeedbackDelay({
  delayTime: "8n",
  feedback: 0.3,
  wet: 0.6,
}).connect(reverb);

// Create subtle distortion
const distortion = new Tone.Distortion({
  distortion: 0.3,
  oversample: "4x",
}).connect(delay);

// Create a gain node to control distortion amount
const distortionGain = new Tone.Gain(0.3);
distortionLFO.connect(distortionGain.gain);

// Connect everything
noise.chain(filter, pan, distortionGain, distortion, reverb);
noise2.chain(filter2, pan, distortionGain, distortion, reverb);
subOsc.chain(subFilter, reverb);

// Create signals to control filter LFO frequencies
const lowFilterRate = new Tone.Signal(0.1);
const highFilterRate = new Tone.Signal(0.15);

// Connect the rate LFO to the filter rate signals
filterRateLFO.connect(lowFilterRate);
filterRateLFO.connect(highFilterRate);

// Connect the rate signals to the filter LFO frequencies
lowFilterRate.connect(filterLFO.frequency);
highFilterRate.connect(filterLFO2.frequency);

// Start LFOs with small delays between them
const now = Tone.now();
filterLFO.start(now);
filterLFO2.start(now + 0.1);
panLFO.start(now + 0.2);
thunderLFO.start(now + 0.3);
distortionLFO.start(now + 0.4);

const sonicPiece: SonicPiece = {
  author: "Santiago Figueiras",
  tags: ["noise", "filter", "experimental", "ambient", "thunder"],
  title: "Noise Filter",
};

export default sonicPiece;
