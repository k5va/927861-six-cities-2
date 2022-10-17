import { Expose, Type } from 'class-transformer';
import { OfferType } from '../../../types/index.js';
import CityResponse from '../../city/response/city.response.js';

export default class OfferShortResponse {
  @Expose()
  public id!: string;

  @Expose()
  public title!: string;

  @Expose()
  public publishDate!: Date;

  @Expose({ name: 'cityId'})
  @Type(() => CityResponse)
  public city!: CityResponse;

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
