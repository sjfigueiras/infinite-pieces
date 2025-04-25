import * as Tone from "tone";
import { SonicPiece } from "../registry";
import { getRandomBetween, scheduleRandomRepeat } from "@/app/utils/tone-utils";

const getReverb = () => new Tone.Reverb(15).toDestination().generate();
const compressor = new Tone.Compressor();

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

const playbackRate = 0.15;
const vol = new Tone.Volume(-10);

/**
 * TODO: Extract to utils file
 * @param arr
 * @returns A random element from the array
 * @template T The type of the elements in the array
 */
const getRandomElement = <T>(arr: T[]): T => {
  const randomIndex = Math.floor(Math.random() * arr.length);
  return arr[randomIndex];
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
const noiseLFO = new Tone.LFO("0.1hz", -32, -38).start();

const noiseEQ = new Tone.EQ3({
  high: -12,
});

const EQLFO = new Tone.LFO("1hz", 1000, 15000).start();
EQLFO.connect(noiseEQ.highFrequency);

noiseLFO.connect(noise.volume);

noise.volume.value = -28;
noise.toDestination();

sub();

const synthLead = new Tone.Synth({
  oscillator: { type: "amsawtooth10" },
}).connect(compressor);

scheduleRandomRepeat(
  function (time) {
    synthLead.triggerAttack("E2", time, 0.5);
  },
  120,
  60,
  getRandomBetween(0, 1),
);

scheduleRandomRepeat(
  function (time) {
    synthLead.triggerAttack("G#3", time, 0.5);
  },
  120,
  60,
  getRandomBetween(0, 2),
);

const synthLFO = new Tone.LFO("0.1hz", 0, 100).start();
synthLFO.connect(synthLead.detune);

synthLead.connect(noiseEQ);

compressor.toDestination();

const noisy: SonicPiece = {
  author: "Santiago Figueiras",
  title: "Noisy",
};

export default noisy;
