import * as Tone from "tone";
import { SonicPiece } from "../registry";
import { getRandomBetween, scheduleRandomRepeat } from "@/app/utils/tone-utils";
import { createUprightSampler } from "@/app/utils/sampler-utils";

const master = new Tone.Gain(0.5).toDestination();

const compressor = new Tone.Compressor();
compressor.connect(master);

const synthGain = new Tone.Gain().connect(compressor);
const lPan = new Tone.Panner(-1);
const rPan = new Tone.Panner(1);

const lSynth = new Tone.Synth({
  oscillator: { type: "sine" },
}).connect(lPan);
const rSynth = new Tone.Synth({
  oscillator: { type: "sine" },
}).connect(rPan);

const sub = () => {
  lSynth.triggerAttackRelease("C1", 0.5, "+1");
  rSynth.triggerAttackRelease("C1", 0.5, "+1.5");

  Tone.getTransport().scheduleOnce(() => {
    sub();
  }, "+4");
};

const delay = new Tone.FeedbackDelay({
  feedback: 0.7,
  delayTime: 2,
  maxDelay: 2,
}).connect(synthGain);

lSynth.connect(delay);
rSynth.connect(delay);
lPan.connect(delay);
rPan.connect(delay);
delay.toDestination();

const noise = new Tone.Noise("pink").start();
const noiseVolume = new Tone.Volume(-38);
noiseVolume.connect(compressor);
noise.connect(noiseVolume);

const EQ = new Tone.EQ3({
  high: -12,
});

const EQLFO = new Tone.LFO("1hz", 1000, 15000).start();
EQLFO.connect(EQ.highFrequency);

sub();

const synthLead = new Tone.Synth({
  oscillator: { type: "amsawtooth10" },
  volume: -19,
}).connect(compressor);

scheduleRandomRepeat(
  (time) => {
    synthLead.triggerAttack("E2", time, 0.5);
    synthLead.frequency.rampTo("F#2", 0.011, time);
  },
  20,
  60,
  getRandomBetween(0, 1),
);

scheduleRandomRepeat(
  (time) => {
    synthLead.triggerAttack("G#3", time, 0.5);
    synthLead.frequency.rampTo("A#3", 0.01, time);
  },
  120,
  60,
  getRandomBetween(0, 2),
);

const synthLFO = new Tone.LFO("0.1hz", 0, 100).start();
synthLFO.connect(synthLead.detune);

const upright = createUprightSampler();
const melodia = ["C4", "E4", "G4", "B4", "C5"];

const pitchShift = new Tone.PitchShift({
  pitch: -5, // this is working and lowers pitch by a fifth
});

upright.connect(pitchShift);
pitchShift.connect(master);

melodia.forEach((nota) => {
  scheduleRandomRepeat(
    (time) => {
      upright.triggerAttack(nota, time);
    },
    60,
    100,
    getRandomBetween(0, 5),
  );
});

/**
 * Master Setup
 */
const panner3d = new Tone.Panner3D();
const rotationZ = new Tone.LFO("20hz", 0, 5).start();
const rotationX = new Tone.LFO("10hz", 0, 2).start();
rotationZ.connect(panner3d.orientationZ);
rotationX.connect(panner3d.orientationX);

synthLead.connect(panner3d);
panner3d.connect(master); // Conecta el compressor al Panner3D
panner3d.connect(compressor);

const heartbeat: SonicPiece = {
  author: "Santiago Figueiras",
  title: "heartbeat",
};

export default heartbeat;
