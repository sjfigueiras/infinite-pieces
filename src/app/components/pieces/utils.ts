import * as Tone from 'tone';

export function getRandomBetween(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export function scheduleRandomRepeat(
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