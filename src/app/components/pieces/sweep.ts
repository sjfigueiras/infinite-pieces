import { registerModulator } from "@/app/utils/tone-utils";
import { Piece } from "./types";
import * as Tone from "tone";

const modulators: Piece['modulators'] = [];

const omniOsc = new Tone.OmniOscillator("C#2", "sine");
const droneLFO = new Tone.LFO("0.001hz", 0, 15);
registerModulator(modulators, 'Drone Frequency', droneLFO);

const omniOsc2 = new Tone.OmniOscillator("G#2", "fatsawtooth");
const droneLFO2 = new Tone.LFO("0.0011hz", 100, 150);
registerModulator(modulators, 'Drone 2 Frequency', droneLFO2);

const DetuneLFO = new Tone.LFO("0.001hz", -1, 1);
registerModulator(modulators, 'EQ Frequency', DetuneLFO);

const EQ = new Tone.EQ3({highFrequency: 2500, high: 0 });

DetuneLFO.connect(EQ.highFrequency);
DetuneLFO.connect(EQ.high);

const omniOsc3 = new Tone.OmniOscillator("F3", "fatsawtooth");
const droneLFO3 = new Tone.LFO("0.001hz", 0, 50);
registerModulator(modulators, 'Drone 3 Frequency', droneLFO3);

const panner1 = new Tone.Panner(0); // Center
const panner2 = new Tone.Panner(-0.5); // Left
const panner3 = new Tone.Panner(0.5); // Right

const omniOsc4 = new Tone.OmniOscillator("C#4", "fatsawtooth");
const droneLFO4 = new Tone.LFO("0.0025hz", 0, 50);
registerModulator(modulators, 'Drone 4 Frequency', droneLFO4);

const omniOsc5 = new Tone.OmniOscillator("A#4", "fatsawtooth");
const droneLFO5 = new Tone.LFO("0.0024hz", 100, 150);
registerModulator(modulators, 'Drone 5 Frequency', droneLFO5);

const panner4 = new Tone.Panner(-1); // Slightly left
const panner5 = new Tone.Panner(1); // Slightly right

const gain1 = new Tone.Gain(0.8); // Initial mix level for omniOsc
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
omniOsc.start();
droneLFO.start();
omniOsc2.start();
droneLFO2.start();
DetuneLFO.start();
omniOsc3.start();
droneLFO3.start();
omniOsc4.start();
droneLFO4.start();
omniOsc5.start();
droneLFO5.start();
tremolo.start();
TremoloLFO.start();

const sweep: Piece = {
    title: 'Sweep',
    modulators,
}

export default sweep;