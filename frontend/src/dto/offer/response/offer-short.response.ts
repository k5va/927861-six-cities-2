import { OfferType } from '../offer-type.enum.js';
import CityResponse from '../../city/response/city.response.js';
import { Offer } from '../../../types/types.js';

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

  public static adaptToOffer({id, price, rating, title, isFavorite, isPremium,
    previewImage, city, type}: OfferShortResponse): Offer {

    return {
      id,
      price,
      rating,
      title,
      isPremium,
      isFavorite,
      previewImage,
      city: {name: city.name, location: {longitude: city.longitude, latitude: city.latitude}},
      type,
      bedrooms: -1,
      description: '',
      location: {longitude: -1, latitude: -1},
      maxAdults: -1,
      goods: [],
      images: [],
      host: {name: '', avatarUrl: '', isPro: false, email: ''}
    };
  }
}
