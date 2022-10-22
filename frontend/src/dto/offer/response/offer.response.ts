import { OfferType } from '../offer-type.enum.js';
import CityResponse from '../../city/response/city.response.js';
import GoodResponse from '../../good/response/good.response.js';
import UserResponse from '../../user/response/user.response.js';
import { Offer } from '../../../types/types.js';

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

  public static adaptToOffer({id, price, rating, title, isFavorite, isPremium,
    previewImage, city, type, bedrooms, description, longitude, latitude,
    maxAdults, goods, images, host}: OfferResponse): Offer {

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
      bedrooms,
      description,
      location: {longitude, latitude},
      maxAdults,
      goods: goods.map(({name}) => name),
      images,
      host
    };
  }
}
