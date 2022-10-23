import { NewOffer, Offer } from '../../types/types';
import CreateOfferDto from './dto/create-offer.dto';
import UpdateOfferDto from './dto/update-offer.dto';
import { OfferType } from './offer-type.enum';
import { DEFAULT_OFFER_IMAGES } from './offer.const';
import OfferShortResponse from './response/offer-short.response';
import OfferResponse from './response/offer.response';

export const adaptToCreateOfferDto = ({title, description, city, previewImage, isPremium, type,
  bedrooms, maxAdults, price, goods, location}: NewOffer)
  : CreateOfferDto => ({
  title,
  description,
  publishDate: new Date(),
  cityId: city.name,
  previewImage,
  images: DEFAULT_OFFER_IMAGES,
  isFavorite: false,
  isPremium,
  type: type as OfferType,
  bedrooms,
  maxAdults,
  price,
  goods,
  hostId: '',
  longitude: location.longitude,
  latitude: location.latitude
});

export const adaptToUpdateOfferDto = ({title, description, city, previewImage, isPremium, type,
  bedrooms, maxAdults, price, goods, location}: Offer)
  : UpdateOfferDto => ({
  title,
  description,
  cityId: city.name,
  previewImage,
  images: DEFAULT_OFFER_IMAGES,
  isPremium,
  type: type as OfferType,
  bedrooms,
  maxAdults,
  price,
  goods,
  longitude: location.longitude,
  latitude: location.latitude
});

export const adaptFromOfferShortResponse = ({id, price, rating, title, isFavorite, isPremium,
  previewImage, city, type}: OfferShortResponse)
  : Offer => ({
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
});

export const adaptFromOfferResponse = ({id, price, rating, title, isFavorite, isPremium,
  previewImage, city, type, bedrooms, description, longitude, latitude,
  maxAdults, goods, images, host}: OfferResponse)
  : Offer => ({
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
});
