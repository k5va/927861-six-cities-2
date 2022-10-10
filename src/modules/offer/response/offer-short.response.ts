import { Expose } from 'class-transformer';
import { City, OfferType } from '../../../types/index.js';

export default class OfferShortResponse {
  @Expose()
  public id!: string;

  @Expose()
  public title!: string;

  @Expose()
  public publishDate!: Date;

  @Expose()
  public city!: City;

  @Expose()
  public previewImage!: string;

  @Expose()
  public isFavorite!: boolean;

  @Expose()
  public isPremium!: boolean;

  @Expose()
  public rating!: number;

  @Expose()
  public commentCount!: number;

  @Expose()
  public type!: OfferType;

  @Expose()
  public price!: number;
}
