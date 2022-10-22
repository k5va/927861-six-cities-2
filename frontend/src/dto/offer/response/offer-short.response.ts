import { OfferType } from '../offer-type.enum.js';
import CityResponse from '../../city/response/city.response.js';

export default class OfferShortResponse {
  public id!: string;
  public title!: string;
  public publishDate!: Date;
  public city!: CityResponse;
  public previewImage!: string;
  public isFavorite!: boolean;
  public isPremium!: boolean;
  public rating!: number;
  public commentCount!: number;
  public type!: OfferType;
  public price!: number;
}
