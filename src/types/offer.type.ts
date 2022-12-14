import City from './city.type.js';
import OfferType from './offer-type.enum.js';
import User from './user.type.js';

type Offer = {
  title: string;
  description: string;
	publishDate: Date;
	city: City;
	previewImage: string;
  images: string[];
  isFavorite: boolean;
  isPremium: boolean;
  type: OfferType;
  bedrooms: number;
  maxAdults: number;
  price: number;
  goods: string[];
  host: User;
  longitude: number;
  latitude: number;
}

export default Offer;
