import { readFileSync } from 'fs';
import { OfferType } from '../../types/offer-type.enum.js';
import { Offer } from '../../types/offer.type.js';
import { FileReaderInterface } from './file-reader.interface.js';

export default class TSVFileReader implements FileReaderInterface {
  private rawData = '';

  /**
   * Creates new instance of TSVFileReader
   * @param filename - tsv file path
   */
  constructor(public filename: string) {}

  /**
   * Reades raw data from provided file
   */
  public read(): void {
    this.rawData = readFileSync(this.filename, { encoding: 'utf8' });
  }

  /**
   * Parses raw data from file and returns array of offers
   * @returns {Offer[]} - array of parsed offers
   */
  public toArray(): Offer[] {
    if (!this.rawData) {
      return [];
    }

    return this.rawData
      .split('\n')
      .filter((row) => row.trim() !== '')
      .map((line) => line.split('\t'))
      .map(([title, description, publishDate, city, previewImage, images, isFavorite,
        isPremium, rating, type, bedrooms, maxAdults, price, goods, name, email,
        avatarUrl, password, isPro, latitude, longitude]) => ({
        title,
        description,
        publishDate: new Date(publishDate),
        city,
        previewImage,
        images: images.split(';'),
        isFavorite: Boolean(isFavorite),
        isPremium: Boolean(isPremium),
        rating: Number(rating),
        type: type as OfferType,
        bedrooms: Number(bedrooms),
        maxAdults: Number(maxAdults),
        price: Number(price),
        goods: goods.split(';'),
        host: {name, email, password, isPro: Boolean(isPro), avatarUrl},
        latitude: Number(latitude),
        longitude: Number(longitude)
      }));
  }
}