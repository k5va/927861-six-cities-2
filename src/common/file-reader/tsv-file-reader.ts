import { readFileSync } from 'fs';
import { OfferType } from '../../types/offer-type.enum.js';
import { Offer } from '../../types/offer.type.js';
import { FileReaderInterface } from './file-reader.interface.js';

export default class TSVFileReader implements FileReaderInterface {
  private rawData = '';

  constructor(public filename: string) {}

  public read(): void {
    this.rawData = readFileSync(this.filename, { encoding: 'utf8' });
  }

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