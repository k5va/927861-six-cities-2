import getRandomNumber from './get-random-number.js';

/**
 * Returns random items from array
 * @param items - array of items
 * @param count - number of items to get
 * @returns - array of random items from given array
 */
const getRandomItems = <T>(items: T[], count: number = getRandomNumber(0, items.length)): T[] => {
  const size = count > items.length ? items.length : count;
  const itemsCopy = [...items];
  const randomItems: T[] = [];

  for (let i = 0; i < size; i++) {
    const index = Math.floor(getRandomNumber(0, itemsCopy.length));
    randomItems.push(itemsCopy[index]);
    itemsCopy.splice(index, 1);
  }

  return randomItems;
};

export default getRandomItems;
