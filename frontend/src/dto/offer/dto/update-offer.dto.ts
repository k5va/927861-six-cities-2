import { OfferType } from '../offer-type.enum.js';

export default class UpdateOfferDto {
  public title?: string;
  public description?: string;
  public cityId?: string;
  public previewImage?: string;
  public images?: string[];
  public isPremium?: boolean;
  public type?: OfferType;
  public bedrooms?: number;
  public maxAdults?: number;
  public price?: number;
  public goods?: string[];
  public longitude?: number;
  public latitude?: number;
}
