import * as Tone from 'tone';
import {
  getRandomBetween,
  scheduleRandomRepeat,
  Modulator,
  registerModulator,
} from '../../utils/tone-utils';
import { createUprightSampler } from '../../utils/sampler-utils';
import { Piece } from './types';

const layerA = createUprightSampler();
const layerB = createUprightSampler();

/**
 * Setup
 */
// const melodia = ['F4', 'Ab4', 'C5', 'Db5', 'Eb5', 'F5', 'Ab5'];
const melodia = ['C4', 'E4', 'G4', 'B4', 'C5'];
const texturasA = ['D6', 'F#6', 'A6'];
const texturasB = ['C6', 'E6', 'A6'];

const bajosA = ['C2', 'G2'];
const bajosB = ['C2', 'A1'];
// const subBajos = ['C0', 'F0'];

// const repeticiones = [23.53, 25.76, 29.123, 19.29, 16.831, 22.432, 27.97];
// const duraciones = [0, 5.23, 20.91, 15.47, 9.77, 19.55, 20.112];

melodia.forEach(function (nota, i) {
  scheduleRandomRepeat(function(time) {
    layerA.triggerAttack(nota, time);
  }, 10, 0, getRandomBetween(0, 5));
});

texturasA.forEach(function (nota, i) {
  scheduleRandomRepeat(function(time) {
    layerA.triggerAttack(nota, time);
  }, 60, 0, getRandomBetween(0, 5));
});

texturasB.forEach(function (nota, i) {
  scheduleRandomRepeat(function(time) {
    layerA.triggerAttack(nota, time);
  }, 120, 60, getRandomBetween(0, 5));
});

bajosA.forEach(function (nota, i) {
  scheduleRandomRepeat(function(time) {
    layerB.triggerAttack(nota, time);
  }, 60, 0, getRandomBetween(0, 5));
});

bajosB.forEach(function (nota, i) {
  scheduleRandomRepeat(function(time) {
    layerB.triggerAttack(nota, time);
  }, 120, 60, getRandomBetween(0, 1));
});


/**
 * Effects
 */
const freeverb = new Tone.Freeverb({ roomSize: .3, dampening: 2000, wet: .8});
const pingPong = new Tone.PingPongDelay({feedback: 0.2, wet: 0.8});
const dist = new Tone.Distortion(0.3);
const EQ = new Tone.EQ3({highFrequency: 8000, high: -12});

/**
 * Extract: Analysers
 */

export const modulators: Modulator[] = [];

/**
 * LFOs
 */
// const delayLFO = new Tone.LFO({frequency: 0.5, min: 0, max: 0.5});
const delayLFO = new Tone.LFO({min: 0, max: 1});
delayLFO.connect(pingPong.delayTime);
delayLFO.start();

const delayFrequencyLFO = new Tone.LFO({frequency: 0.001, min: 0, max: 0.001});

const delayLFOSignal = new Tone.Signal(0);
delayFrequencyLFO.connect(delayLFOSignal);

delayFrequencyLFO.connect(delayLFO.frequency); 
delayFrequencyLFO.start();

const samplerVolumeLFO = new Tone.LFO({ type: "square", frequency: 0.001, min: -16, max: 0 });

const samplerVolumeLFOSignal = new Tone.Signal(0);
samplerVolumeLFO.connect(samplerVolumeLFOSignal);

samplerVolumeLFO.connect(layerA.volume);
samplerVolumeLFO.start();

const structureLFO = new Tone.LFO({frequency: 0.5, min: 0, max: 1});

const structureLFOLFOSignal = new Tone.Signal(0);
structureLFO.connect(structureLFOLFOSignal);

structureLFO.connect(pingPong.wet);
structureLFO.start();

registerModulator(modulators, 'Delay Frequency', delayFrequencyLFO, delayLFOSignal);
registerModulator(modulators, 'Sampler Volume', samplerVolumeLFO, samplerVolumeLFOSignal);
registerModulator(modulators, 'Structural', structureLFO, structureLFOLFOSignal);

/**
 * Sends
 */
layerA.connect(pingPong);
pingPong.connect(freeverb);
freeverb.connect(EQ)
EQ.toDestination();

layerB.toDestination();

const ondulado: Piece = {
    title: 'Entusiasmo',
    modulators,
}

export default ondulado;