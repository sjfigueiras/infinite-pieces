import * as Tone from "tone";

export function getRandomBetween(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

export interface Modulator {
  analyser: Tone.Analyser;
  lfo: Tone.LFO;
  name: string;
  signal?: Tone.Signal;
}

export function scheduleRandomRepeat(
  scheduledFunction: (time: number) => void,
  minDelay: number,
  maxDelay: number,
  startTime = getRandomBetween(minDelay, maxDelay),
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
  lfo: Tone.LFO,
  signal?: Tone.Signal,
): void {
  modulators.push({
    name,
    analyser: createAnalyser(lfo),
    lfo,
    signal,
  });
}

/**
 * TODO: Review this function if we still wan't to
 * plot anylisers.
 */
// export const drawAnalysers = (registeredLFOs: any) => {
//   function draw(ctx: any, canvas: any, analyser: any) {
//     requestAnimationFrame(() => draw(ctx, canvas, analyser));
//     const values = analyser.getValue();

//     // Limpiar canvas
//     ctx.clearRect(0, 0, canvas.width, canvas.height);
//     ctx.beginPath();
//     ctx.strokeStyle = "#ff0077";
//     ctx.lineWidth = 2;

//     // Dibujar la forma de onda
//     for (let i = 0; i < values.length; i++) {
//       const x = (i / values.length) * canvas.width;
//       const y = (1 - (values[i] + 1) / 2) * canvas.height;
//       if (i === 0) {
//         ctx.moveTo(x, y);
//       } else {
//         ctx.lineTo(x, y);
//       }
//     }

//     ctx.stroke();
//   }

//   const lfoContainer = document.getElementById("lfo-container")!;

//   registeredLFOs.forEach((registeredLFO: Modulator, i: number) => {
//     // Configurar canvas
//     const canvas = document.createElement("canvas");
//     canvas.setAttribute("id", `anaylser-node-${i}`);
//     canvas.setAttribute("style", "background-color: white");

//     lfoContainer.appendChild(document.createTextNode(registeredLFO.name));
//     lfoContainer.appendChild(canvas);

//     const ctx = canvas.getContext("2d");
//     canvas.width = 200;
//     canvas.height = 200;

//     draw(ctx, canvas, registeredLFO.analyser);
//   });
// };
