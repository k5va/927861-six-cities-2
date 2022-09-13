import getRandomNumber from './get-random-number.js';

/**
 * Returns random item from array
 * @param items - array of items
 * @returns - random item from array
 */
const getRandomItem = <T = string>(items: T[]): T => items[getRandomNumber(0, items.length - 1)];

export default getRandomItem;
