import { OfferEntity } from '../modules/index.js';

const setIsOfferFavoriteOfUser = (
  userId: string | undefined,
  offer: OfferEntity | null)
  : OfferEntity | null => {

  if (!offer) {
    return null;
  }

  const isFavorite = userId ? offer.inFavorites.some((currentId) => currentId?.id === userId) : false;

  return {...offer, isFavorite};
};

export default setIsOfferFavoriteOfUser;
