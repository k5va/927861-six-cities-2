const getRandomNumber = (min: number, max: number, numAfterDigit = 0): number =>
  +(min + Math.random() * (max - min)).toFixed(numAfterDigit);

export default getRandomNumber;
