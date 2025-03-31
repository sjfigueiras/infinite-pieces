declare module "canvas-sketch-util/random" {
  const random: {
    getRandomSeed(): number;
    setSeed(arg0: number | string): void;
    range(min: number, max: number): number;
    pick<T>(array: T[]): T;
    value(): number;
    // Add other methods as needed
  };
  export default random;
}
