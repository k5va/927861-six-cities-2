import { Offer, OfferType } from '../../types/index.js';

const DATA_SPLITTER = '\t';
const LIST_SPLITTER = ';';

/**
 * Creates offer from line of data
 * @param {String} line - line of data
 * @returns {Offer} - offer object
 */
export const createOffer = (line: string): Offer => {
  const [title, description, publishDate, city, previewImage, images, isFavorite,
    isPremium, type, bedrooms, maxAdults, price, goods, name, email,
    avatarUrl, password, isPro, latitude, longitude] = line.split(DATA_SPLITTER);

  return ({
    title,
    description,
    publishDate: new Date(publishDate),
    city: {name: city},
    previewImage,
    images: images.split(LIST_SPLITTER),
    isFavorite: Boolean(isFavorite),
    isPremium: Boolean(isPremium),
    type: type as OfferType,
    bedrooms: Number(bedrooms),
    maxAdults: Number(maxAdults),
    price: Number(price),
    goods: goods.split(LIST_SPLITTER),
    host: {name, email, password, isPro: Boolean(isPro), avatarUrl},
    latitude: Number(latitude),
    longitude: Number(longitude)
  });
};
