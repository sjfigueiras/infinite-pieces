import * as Tone from 'tone';

const uprightMap = {
    "A0": "a0.wav",
    "C#1": "csharp1.wav",
    "F1": "f1.wav",
    "C#2": "csharp2.wav",
    "F2": "f2.wav",
    "A2": "a2.wav",
    "C#3": "csharp3.wav",
    "F3": "f3.wav",
    "A3": "a3.wav",
    "C#4": "csharp4.wav",
    "F4": "f4.wav",
    "A4": "a4.wav",
    "C#5": "csharp5.wav",
    "F5": "f5.wav",
    "A5": "a5.wav",
    "C#6": "csharp6.wav",
    "F6": "f6.wav",
    "A6": "a6.wav",
    "C#7": "csharp7.wav",
    "F7": "f7.wav",
    "A7": "a7.wav",
    "C8": "c8.wav"
};

const samplerConfig = {
    samples: {
        baseUrl: '/samples/vsco2-ce/upright-piano/',
        urls: uprightMap,
    },
  onload: async function () {
    return Tone.start();
  },
};

const sampler = new Tone.Sampler(
    uprightMap,
    samplerConfig.onload,
    '/samples/vsco2-ce/upright-piano/'
);

const samplerUntouched = new Tone.Sampler(
    uprightMap,
    samplerConfig.onload,
    '/samples/vsco2-ce/upright-piano/'
);

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
    sampler.triggerAttack(nota, time);
  }, 10, 0, getRandomBetween(0, 5));
});

texturasA.forEach(function (nota, i) {
  scheduleRandomRepeat(function(time) {
    sampler.triggerAttack(nota, time);
  }, 60, 0, getRandomBetween(0, 5));
});

texturasB.forEach(function (nota, i) {
  scheduleRandomRepeat(function(time) {
    sampler.triggerAttack(nota, time);
  }, 120, 60, getRandomBetween(0, 5));
});

bajosA.forEach(function (nota, i) {
  scheduleRandomRepeat(function(time) {
    samplerUntouched.triggerAttack(nota, time);
  }, 60, 0, getRandomBetween(0, 5));
});

bajosB.forEach(function (nota, i) {
  scheduleRandomRepeat(function(time) {
    samplerUntouched.triggerAttack(nota, time);
  }, 120, 60, getRandomBetween(0, 1));
});

/**
 * Modular bajos solo cada cierta cantidad de tiempo
 */

// subBajos.forEach(function (nota, i) {
//   scheduleRandomRepeat(function(time) {
//     samplerUntouched.triggerAttack(nota, time);
//   }, 60, 0, getRandomBetween(0, 20));
// });


function getRandomBetween(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function scheduleRandomRepeat(
    scheduledFunction: (time: number) => void,
    minDelay: number,
    maxDelay:number, 
    startTime = getRandomBetween(minDelay, maxDelay)
) {
  Tone.Transport.scheduleOnce(function(time: number) {
    scheduledFunction(time);
    const delay = getRandomBetween(minDelay, maxDelay);
    scheduleRandomRepeat(scheduledFunction, minDelay, maxDelay, time + delay);
  }, startTime);
}

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

interface LFOAnalyser {
    analyser: Tone.Analyser;
    lfo: Tone.LFO;
    name: string;
}

export const modulators: LFOAnalyser[] = [];

function registerModultor (name: string, lfo: Tone.LFO) {
  modulators.push({
    name,
    analyser: createAnalyser(lfo),
    lfo
  });
}

function createAnalyser (targetLfo: Tone.LFO) {
  const analyser = new Tone.Analyser("waveform");
  targetLfo.connect(analyser);
  return analyser;
} 

/**
 * LFOs
 */
// const delayLFO = new Tone.LFO({frequency: 0.5, min: 0, max: 0.5});
const delayLFO = new Tone.LFO({min: 0, max: 1});
delayLFO.connect(pingPong.delayTime);
delayLFO.start();

const delayFrequencyLFO = new Tone.LFO({frequency: 0.001, min: 0, max: 0.001});
delayFrequencyLFO.connect(delayLFO.frequency); 
delayFrequencyLFO.start();

const samplerVolumeLFO = new Tone.LFO({ type: "square", frequency: 0.001, min: -16, max: 0 });
samplerVolumeLFO.connect(sampler.volume);
samplerVolumeLFO.start();

const structureLFO = new Tone.LFO({frequency: 0.5, min: 0, max: 1});
structureLFO.connect(pingPong.wet);
structureLFO.start();

registerModultor('Delay Frequency', delayFrequencyLFO);
registerModultor('Sampler Volume', samplerVolumeLFO);
registerModultor('Structural', structureLFO);

/**
 * TODO:
 * 
 * Separar alguna cada que no este atada al delay para dar profundidad
 * Agregar samples de voces
 * Utilizar LFOs a nivel estructural de la pieza, frecuencias muy bajas
 * para realizar evoluciones muy lentas en la pieza.
 * 
 * Reflexiones: la forma de una pieza se puede representar en contraste mediante
 * una forma de onda cuadrada. Dentro de la forma el crescendo, o la acumu
 * lación de las transformaciones en los parametros se puede representar
 * con una onda diente de sierra.
 * Combinando ambas se pueden crear macro estructuras de piezas a partir
 * de la definición de bloques fundamentales desarrollados en el tiempo
 * con LFOs.
 */

console.log('All loaded');

/**
 * Sends
 */
sampler.connect(pingPong);
pingPong.connect(freeverb);
freeverb.connect(EQ)
EQ.toDestination();

// dist.connect(samplerUntouched);
samplerUntouched.toDestination();