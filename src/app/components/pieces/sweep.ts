import { registerModulator } from "@/app/utils/tone-utils";
import { Piece } from "./types";
import * as Tone from "tone";
import { OmniOscillatorType } from "tone/build/esm/source/oscillator/OscillatorInterface";

// Utility function to create an oscillator with an LFO
function createLFOOscillator(
  modulators: Piece["modulators"],
  title: string,
  oscillatorType: OmniOscillatorType,
  baseFrequency: string,
  lfoFrequency: string,
  lfoMin: number,
  lfoMax: number,
) {
  const oscillator = new Tone.OmniOscillator(baseFrequency, oscillatorType);
  const lfo = new Tone.LFO(lfoFrequency, lfoMin, lfoMax);
  registerModulator(modulators, title, lfo);
  lfo.connect(oscillator.frequency);
  return { oscillator, lfo };
}

const modulators: Piece["modulators"] = [];

// Abstracted oscillator and LFO creation
const { oscillator: omniOsc, lfo: droneLFO } = createLFOOscillator(
  modulators,
  "Drone Frequency",
  "sine",
  "C#2",
  "0.001hz",
  0,
  15,
);

const { oscillator: omniOsc2, lfo: droneLFO2 } = createLFOOscillator(
  modulators,
  "Drone 2 Frequency",
  "fatsawtooth",
  "G#2",
  "0.0011hz",
  100,
  150,
);

const { oscillator: omniOsc3, lfo: droneLFO3 } = createLFOOscillator(
  modulators,
  "Drone 3 Frequency",
  "fatsawtooth",
  "F3",
  "0.001hz",
  0,
  50,
);

const { oscillator: omniOsc4, lfo: droneLFO4 } = createLFOOscillator(
  modulators,
  "Drone 4 Frequency",
  "fatsawtooth",
  "C#4",
  "0.0025hz",
  0,
  50,
);

const { oscillator: omniOsc5, lfo: droneLFO5 } = createLFOOscillator(
  modulators,
  "Drone 5 Frequency",
  "fatsawtooth",
  "A#4",
  "0.0024hz",
  100,
  150,
);

// Function to update oscillator frequencies dynamically
// The frequency change is not working currently
function updateFrequencies(chord: number | string[], time: number): void {
  console.log("Chord:", chord);
  if (typeof chord === "number") return;
  [omniOsc, omniOsc2, omniOsc3, omniOsc4, omniOsc5].forEach((osc, index) => {
    if (chord[index]) {
      console.log("Setting frequency:", chord[index]);
      // Schedule the frequency change at the given time
      console.log({ "current frequency": osc.frequency });
      osc.frequency.setValueAtTime(chord[index], time);
    }
  });
}

// Example: Schedule chord changes
const chords = [
  ["C#2", "G#2", "F3", "C#4", "A#4"],
  ["D2", "A2", "G3", "D4", "B4"],
  // ["E2", "B2", "A3", "E4", "C5"],
  ["F2", "C2", "A#3", "F4", "C#5"],
];

const chordPart = new Tone.Part(
  (time, chord) => {
    updateFrequencies(chord, time); // Pass the time parameter
  },
  [
    [0, chords[0]],
    [4, chords[1]],
    [8, chords[2]],
  ],
);

chordPart.loop = true;
chordPart.loopEnd = "12m";
chordPart.start(0);

const panner1 = new Tone.Panner(0); // Center
const panner2 = new Tone.Panner(-0.5); // Left
const panner3 = new Tone.Panner(0.5); // Right

const panner4 = new Tone.Panner(-1); // Slightly left
const panner5 = new Tone.Panner(1); // Slightly right

const gain1 = new Tone.Gain(0.8); // Initial mix level for omniOsc
const gain2 = new Tone.Gain(0.2); // Initial mix level for omniOsc2
const gain3 = new Tone.Gain(0.5); // Initial mix level for omniOsc3
const gain4 = new Tone.Gain(0.1); // Initial mix level for omniOsc4
const gain5 = new Tone.Gain(0.1); // Initial mix level for omniOsc5

// const gain1 = new Tone.Gain(0.8); // Initial mix level for omniOsc
// const gain2 = new Tone.Gain(1); // Initial mix level for omniOsc2
// const gain3 = new Tone.Gain(0); // Initial mix level for omniOsc3
// const gain4 = new Tone.Gain(0); // Initial mix level for omniOsc4
// const gain5 = new Tone.Gain(0); // Initial mix level for omniOsc5

omniOsc.connect(gain1);
omniOsc2.connect(gain2);
omniOsc3.connect(gain3);
omniOsc4.connect(gain4);
omniOsc5.connect(gain5);

gain1.connect(panner1);
gain2.connect(panner2);
gain3.connect(panner3);
gain4.connect(panner4);
gain5.connect(panner5);

const EQ = new Tone.EQ3({ highFrequency: 2500, high: 0 });

const DetuneLFO = new Tone.LFO("0.001hz", -1, 1);
registerModulator(modulators, "EQ Frequency", DetuneLFO);

DetuneLFO.connect(EQ.highFrequency);
DetuneLFO.connect(EQ.high);

panner1.connect(EQ);
panner2.connect(EQ);
panner3.connect(EQ);
panner4.connect(EQ);
panner5.connect(EQ);

const tremolo = new Tone.Tremolo(10, 0.5);
const TremoloLFO = new Tone.LFO("0.1hz", 10, 50);
TremoloLFO.connect(tremolo.frequency);

tremolo.connect(EQ);

const freeverb = new Tone.Freeverb({ roomSize: 0.3, dampening: 500, wet: 0.8 });

const stereoWidener = new Tone.StereoWidener(0.8); // Width set to 0.8
const volume = new Tone.Volume(-19); // Reduce volume by 12dB
const limiter = new Tone.Limiter(-3); // Limit output to -6dB

EQ.connect(freeverb);
freeverb.connect(stereoWidener);
stereoWidener.connect(volume);
volume.connect(limiter);
limiter.toDestination();

// Start all oscillators and LFOs
[omniOsc, omniOsc2, omniOsc3, omniOsc4, omniOsc5].forEach((osc) => osc.start());
[droneLFO, droneLFO2, droneLFO3, droneLFO4, droneLFO5].forEach((lfo) =>
  lfo.start(),
);
tremolo.start();
TremoloLFO.start();
DetuneLFO.start();

const sweep: Piece = {
  title: "Sweep",
  modulators,
};

export default sweep;
