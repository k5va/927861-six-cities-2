import { Bedrooms, MaxAdults, Price, Rating } from '../../const/index.js';
import { MockData } from '../../types/index.js';
import { getRandomBoolean, getRandomItem, getRandomItems, getRandomNumber }
  from '../../utils/index.js';
import { OfferGeneratorInterface } from './offer-generator.interface';

export default class OfferGenerator implements OfferGeneratorInterface {
  private static readonly MAX_OFFER_NUM = 1000;
  private static readonly DATA_SPLITTER = '\t';
  private static readonly ITEMS_SPLITTER = ';';

  /**
   * Creates new instance of offer generator
   * @param {MockData} mockData
   * @param {number} maxNum - max number of offers to be generated
   */
  constructor(
    private readonly mockData: MockData,
    private readonly maxNum: number = OfferGenerator.MAX_OFFER_NUM)
  {}

  /**
   * Generates offer string in TSV format
   * @returns {string} - generated string
   */
  public * generate(): Generator<string> {
    for (let i = 1; i <= this.maxNum; i++) {
      const title = getRandomItem(this.mockData.titles);
      const description = getRandomItem(this.mockData.descriptions);
      const publishDate = getRandomItem(this.mockData.dates);
      const city = getRandomItem(this.mockData.cities);
      const previewImage = getRandomItem(this.mockData.images);
      const images = getRandomItems(this.mockData.images).join(OfferGenerator.ITEMS_SPLITTER);
      const isFavorite = getRandomBoolean();
      const isPremium = getRandomBoolean();
      const rating = getRandomNumber(Rating.min, Rating.max, Rating.decimal);
      const type = getRandomItem(this.mockData.types);
      const bedrooms = getRandomNumber(Bedrooms.min, Bedrooms.max);
      const maxAdults = getRandomNumber(MaxAdults.min, MaxAdults.max);
      const price = getRandomNumber(Price.min, Price.max);
      const goods = getRandomItems(this.mockData.goods).join(OfferGenerator.ITEMS_SPLITTER);
      const name = getRandomItem(this.mockData.names);
      const email = getRandomItem(this.mockData.emails);
      const avatar = getRandomItem(this.mockData.avatars);
      const password = getRandomItem(this.mockData.passwords);
      const isPro = getRandomBoolean();
      const longitude = getRandomItem(this.mockData.longitudes);
      const latitude = getRandomItem(this.mockData.latitudes);

      yield [
        title, description, publishDate, city, previewImage, images,
        isFavorite, isPremium, rating, type, bedrooms, maxAdults, price,
        goods, name, email, avatar, password, isPro, longitude, latitude
      ].join(OfferGenerator.DATA_SPLITTER);
    }
  }
}
