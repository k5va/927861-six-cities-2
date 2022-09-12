import EventEmitter from 'events';
import { createReadStream } from 'fs';
import { OfferType } from '../../types/offer-type.enum.js';
import { Offer } from '../../types/offer.type.js';
import { FileReaderInterface } from './file-reader.interface.js';

export default class TSVFileReader extends EventEmitter implements FileReaderInterface {
  public static readonly READ_LINE_EVENT = 'readline';
  public static readonly END_OF_FILE_EVENT = 'end';
  private static readonly READ_SIZE = 16000;
  private static readonly FILE_ENCODING = 'utf-8';
  private static readonly END_OF_LINE = '\n';

  private rawData = '';

  /**
   * Creates new instance of TSVFileReader
   * @param filename - tsv file path
   */
  constructor(public filename: string) {
    super();
  }

  /**
   * Reades raw data from provided file
   */
  public read(): void {
    const readStream = createReadStream(
      this.filename, {highWaterMark: TSVFileReader.READ_SIZE, encoding: TSVFileReader.FILE_ENCODING}
    );
    let line = '';

    readStream
      .on('readable', () => {
        let endOfLine = -1;
        let chunk = '';
        while ((chunk = readStream.read(TSVFileReader.READ_SIZE)) !== null) {
          line = line.concat(chunk);
          while ((endOfLine = line.indexOf(TSVFileReader.END_OF_LINE)) !== -1) {
            this.emit(TSVFileReader.READ_LINE_EVENT, line.substring(0, endOfLine));
            line = line.substring(endOfLine + 1);
          }
        }
      })
      .once('end', () => this.emit(TSVFileReader.END_OF_FILE_EVENT));
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
