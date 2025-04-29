/**
 * @param arr
 * @returns A random element from the array
 * @template T The type of the elements in the array
 */
const getRandomElement = <T>(arr: T[]): T => {
  const randomIndex = Math.floor(Math.random() * arr.length);
  return arr[randomIndex];
};

export { getRandomElement };
