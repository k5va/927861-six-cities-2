import getRandomNumber from './get-random-number.js';

/**
 * Returns random item from array
 * @param items - array of items
 * @returns - random item from array
 */
const getRandomItem = <T = string>(items: T[]): T => {
  const randomNum = getRandomNumber(0, items.length - 1);
  const index = Math.floor(randomNum);
  return items[index];
};

export default getRandomItem;
