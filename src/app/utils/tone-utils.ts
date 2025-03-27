import * as Tone from 'tone';

export function getRandomBetween(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

export interface Modulator {
  analyser: Tone.Analyser;
  lfo: Tone.LFO;
  name: string;
}

export function scheduleRandomRepeat(
  scheduledFunction: (time: number) => void,
  minDelay: number,
  maxDelay: number,
  startTime = getRandomBetween(minDelay, maxDelay)
): void {
  Tone.Transport.scheduleOnce((time: number) => {
    scheduledFunction(time);
    const delay = getRandomBetween(minDelay, maxDelay);
    scheduleRandomRepeat(scheduledFunction, minDelay, maxDelay, time + delay);
  }, startTime);
}

export function createAnalyser(targetLfo: Tone.LFO): Tone.Analyser {
  const analyser = new Tone.Analyser("waveform");
  targetLfo.connect(analyser);
  return analyser;
}

export function registerModulator(
  modulators: Modulator[],
  name: string,
  lfo: Tone.LFO
): void {
  modulators.push({
    name,
    analyser: createAnalyser(lfo),
    lfo,
  });
}