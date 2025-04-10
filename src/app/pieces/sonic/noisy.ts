import { registerModulator } from "@/app/utils/tone-utils";
import { SonicPiece } from "../registry";
import * as Tone from "tone";

const modulators: SonicPiece["modulators"] = [];

const omniOsc = new Tone.OmniOscillator("C#2", "sine");
const omniOsc2 = new Tone.OmniOscillator("G#2", "fatsawtooth");
const omniOsc3 = new Tone.OmniOscillator("F3", "fatsawtooth");
const omniOsc4 = new Tone.OmniOscillator("C#4", "fatsawtooth");
const omniOsc5 = new Tone.OmniOscillator("A#4", "fatsawtooth");

const droneLFO = new Tone.LFO("0.05hz", 0, 100);
const droneLFO2 = new Tone.LFO("0.11hz", 50, 200);
const droneLFO3 = new Tone.LFO("0.12hz", 30, 190);
const droneLFO4 = new Tone.LFO("0.13hz", 20, 170);
const droneLFO5 = new Tone.LFO("0.14hz", 40, 200);

const metaLFO = new Tone.LFO("0.02hz", 0.01, 0.1);
const DetuneLFO = new Tone.LFO("0.001hz", -1, 1);
const TremoloLFO = new Tone.LFO("0.1hz", 10, 50);
const tremolo = new Tone.Tremolo(10, 0.5);

// Start all oscillators and LFOs
omniOsc.start();
omniOsc2.start();
omniOsc3.start();
omniOsc4.start();
omniOsc5.start();

droneLFO.start();
droneLFO2.start();
droneLFO3.start();
droneLFO4.start();
droneLFO5.start();

metaLFO.start();
DetuneLFO.start();
TremoloLFO.start();
tremolo.start();

droneLFO.phase = 0; // No phase offset
droneLFO.connect(omniOsc.frequency);
registerModulator(modulators, "Drone Frequency", droneLFO);

metaLFO.connect(droneLFO.frequency); // Modulate the frequency of droneLFO
registerModulator(modulators, "Meta LFO", metaLFO);

droneLFO2.phase = 45; // 45-degree phase offset
droneLFO2.connect(omniOsc2.frequency);
registerModulator(modulators, "Drone 2 Frequency", droneLFO2);

DetuneLFO.connect(omniOsc2.detune);
DetuneLFO.connect(omniOsc.detune);
registerModulator(modulators, "EQ Frequency", DetuneLFO);

const EQ = new Tone.EQ3({ highFrequency: 2500, high: -12 });

DetuneLFO.connect(EQ.highFrequency);
DetuneLFO.connect(EQ.high);
// const freeverb = new Tone.Freeverb({ roomSize: .3, dampening: 2000, wet: 0.8 });

droneLFO3.phase = 90; // 90-degree phase offset
droneLFO3.connect(omniOsc3.frequency);
registerModulator(modulators, "Drone 3 Frequency", droneLFO3);

const panner1 = new Tone.Panner(0); // Center
// const panner2 = new Tone.Panner(-1); // Left
// const panner3 = new Tone.Panner(1); // Right
const panner2 = new Tone.Panner(-0.5); // Left
const panner3 = new Tone.Panner(0.5); // Right

droneLFO4.phase = 135; // 135-degree phase offset
droneLFO4.connect(omniOsc4.frequency);
registerModulator(modulators, "Drone 4 Frequency", droneLFO4);

droneLFO5.phase = 180; // 180-degree phase offset
droneLFO5.connect(omniOsc5.frequency);
registerModulator(modulators, "Drone 5 Frequency", droneLFO5);

const panner4 = new Tone.Panner(-1); // Slightly left
const panner5 = new Tone.Panner(1); // Slightly right

const gain1 = new Tone.Gain(0.9); // Initial mix level for omniOsc
const gain2 = new Tone.Gain(0.2); // Initial mix level for omniOsc2
const gain3 = new Tone.Gain(0.5); // Initial mix level for omniOsc3
const gain4 = new Tone.Gain(0.1); // Initial mix level for omniOsc4
const gain5 = new Tone.Gain(0.1); // Initial mix level for omniOsc5

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

panner1.connect(EQ);
panner2.connect(EQ);
panner3.connect(EQ);
panner4.connect(EQ);
panner5.connect(EQ);

TremoloLFO.connect(tremolo.frequency);

tremolo.connect(EQ);

const distortion = new Tone.Distortion(0.1); // Add distortion with moderate amount

// Connect distortion to the signal chain
EQ.connect(distortion);

const freeverb = new Tone.Freeverb({ roomSize: 0.8, dampening: 500, wet: 0.5 });

const stereoWidener = new Tone.StereoWidener(0.8); // Width set to 0.8
const volume = new Tone.Volume(-16); // Reduce volume by 12dB
const limiter = new Tone.Limiter(-3); // Limit output to -6dB

distortion.connect(freeverb);
freeverb.connect(stereoWidener);
stereoWidener.connect(volume);
volume.connect(limiter);
limiter.toDestination();

// Schedule oscillator start and stop times
const scheduleTimes = [
  { osc: omniOsc, start: 0, stop: 25 },
  { osc: omniOsc2, start: 30, stop: 5 },
  { osc: omniOsc3, start: 10, stop: 35 },
  { osc: omniOsc4, start: 40, stop: 15 },
  { osc: omniOsc5, start: 20, stop: 45 },
];

scheduleTimes.forEach(({ osc, start, stop }) => {
  Tone.Transport.schedule((time) => osc.start(time), start);
  Tone.Transport.schedule((time) => osc.stop(time + stop), start);
});

const noisy: SonicPiece = {
  title: "Noisy",
  modulators,
};

export default noisy;
