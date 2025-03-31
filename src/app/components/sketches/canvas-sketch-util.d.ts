declare module "canvas-sketch-util/random" {
  const random: {
    setSeed(seed: unknown): unknown;
    getRandomSeed(): unknown;
    range(min: number, max: number): number;
    pick<T>(array: T[]): T;
    value(): number;
    // Add other methods as needed
  };
  export default random;
}

declare module "canvas-sketch-util/color" {
  const Color: {
    offsetHSL: (
      color: string,
      h: number,
      s: number,
      l: number,
    ) => { rgba: number[] };
    style: (rgba: number[]) => string;
  };
  export default Color;
}

declare module "canvas-sketch-util/math" {
  export function degToRad(degrees: number): number;
  export function radToDeg(radians: number): number;
  export function clamp(value: number, min: number, max: number): number;
  export function lerp(min: number, max: number, t: number): number;
  export function mapRange(
    value: number,
    inputMin: number,
    inputMax: number,
    outputMin: number,
    outputMax: number,
    clamp?: boolean,
  ): number;
}
