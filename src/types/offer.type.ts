import { OfferType } from './offer-type.enum.js';
import { User } from './user.type.js';

export type Offer = {
  title: string;
  description: string;
	publishDate: Date;
	city: string;
	previewImage: string;
  images: string[];
  isFavorite: boolean;
  isPremium: boolean;
  rating: number;
  type: OfferType;
  bedrooms: number;
  maxAdults: number;
  price: number;
  goods: string[];
  host: User;
  longitude: number;
  latitude: number;
}

