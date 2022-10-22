import { OfferType } from '../offer-type.enum.js';
import CityResponse from '../../city/response/city.response.js';
import GoodResponse from '../../good/response/good.response.js';
import UserResponse from '../../user/response/user.response.js';

export default class OfferResponse {
  public id!: string;
  public title!: string;
  public description!: string;
  public publishDate!: Date;
  public city!: CityResponse;
  public previewImage!: string;
  public images!: string[];
  public isFavorite!: boolean;
  public isPremium!: boolean;
  public rating!: number;
  public commentCount!: number;
  public type!: OfferType;
  public bedrooms!: number;
  public maxAdults!: number;
  public price!: number;
  public goods!: GoodResponse[];
  public host!: UserResponse;
  public longitude!: number;
  public latitude!: number;
}
