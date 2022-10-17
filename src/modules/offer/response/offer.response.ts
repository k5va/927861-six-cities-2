import { Expose, Type } from 'class-transformer';
import { OfferType } from '../../../types/index.js';
import CityResponse from '../../city/response/city.response.js';
import GoodResponse from '../../good/response/good.response.js';
import UserResponse from '../../user/response/user.response.js';

export default class OfferResponse {
  @Expose()
  public id!: string;

  @Expose()
  public title!: string;

  @Expose()
  public description!: string;

  @Expose()
  public publishDate!: Date;

  @Expose({ name: 'cityId'})
  @Type(() => CityResponse)
  public city!: CityResponse;

  @Expose()
  public previewImage!: string;

  @Expose()
  public images!: string[];

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
  public bedrooms!: number;

  @Expose()
  public maxAdults!: number;

  @Expose()
  public price!: number;

  @Expose()
  @Type(() => GoodResponse)
  public goods!: GoodResponse[];

  @Expose({ name: 'hostId'})
  @Type(() => UserResponse)
  public host!: UserResponse;

  @Expose()
  public longitude!: number;

  @Expose()
  public latitude!: number;
}
