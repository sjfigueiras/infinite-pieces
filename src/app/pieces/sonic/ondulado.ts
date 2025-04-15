import * as Tone from "tone";
import {
  getRandomBetween,
  scheduleRandomRepeat,
  Modulator,
  registerModulator,
} from "../../utils/tone-utils";
import { createUprightSampler } from "../../utils/sampler-utils";
import { SonicPiece } from "../registry";

const layerA = createUprightSampler();
const layerB = createUprightSampler();

/**
 * Composición
 */
const melodia = ["F4", "Ab4", "C5", "Db5", "Eb5", "F5", "Ab5"];
// const melodia = ['F4', 'G4', 'Ab4', 'Bb4', 'C5'];
const texturas = ["D7", "Ab7", "G7"];
const bajos = ["C1", "F1"];

// const repeticiones = [23.53, 25.76, 29.123, 19.29, 16.831, 22.432, 27.97];
// const duraciones = [0, 5.23, 20.91, 15.47, 9.77, 19.55, 20.112];

melodia.forEach(function (nota) {
  scheduleRandomRepeat(
    function (time) {
      layerA.triggerAttack(nota, time);
    },
    30,
    30,
    getRandomBetween(10, 35),
  );
});

texturas.forEach(function (nota) {
  scheduleRandomRepeat(
    function (time) {
      layerA.triggerAttack(nota, time);
    },
    1,
    10,
    getRandomBetween(10, 15),
  );
});

bajos.forEach(function (nota) {
  scheduleRandomRepeat(
    function (time) {
      layerB.triggerAttack(nota, time);
    },
    20,
    0,
    getRandomBetween(0, 40),
  );
});

/**
 * Effects
 */
const freeverb = new Tone.Freeverb({
  roomSize: 0.3,
  dampening: 2000,
  wet: 0.8,
});
const pingPong = new Tone.PingPongDelay({ feedback: 0.2, wet: 0.8 });
const EQ = new Tone.EQ3({ highFrequency: 8000, high: -12 });

/**
 * Extract: Analysers
 */

export const modulators: Modulator[] = [];

/**
 * LFOs
 */
// const delayLFO = new Tone.LFO({frequency: 0.5, min: 0, max: 0.5});
const delayLFO = new Tone.LFO({ min: 0, max: 1 });
delayLFO.connect(pingPong.delayTime);
delayLFO.start();

const delayFrequencyLFO = new Tone.LFO({ frequency: 0.001, min: 0, max: 0.15 });
delayFrequencyLFO.connect(delayLFO.frequency);
delayFrequencyLFO.start();

const samplerVolumeLFO = new Tone.LFO({
  type: "square",
  frequency: 0.001,
  min: -16,
  max: 0,
});
samplerVolumeLFO.connect(layerA.volume);
samplerVolumeLFO.start();

const structureLFO = new Tone.LFO({ frequency: 0.5, min: 0, max: 1 });
structureLFO.connect(pingPong.wet);
structureLFO.start();

registerModulator(modulators, "Delay Frequency", delayFrequencyLFO);
registerModulator(modulators, "Sampler Volume", samplerVolumeLFO);
registerModulator(modulators, "Structural", structureLFO);

/**
 * Sends
 */
layerA.connect(pingPong);
pingPong.connect(freeverb);
freeverb.connect(EQ);
EQ.toDestination();

layerB.toDestination();

const ondulado: SonicPiece = {
  author: "Santiago Figueiras",
  title: "Ondulado",
  modulators,
};

export default ondulado;
