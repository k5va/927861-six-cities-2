import { OfferType } from '../offer-type.enum.js';

export default class CreateOfferDto {
  public title!: string;
  public description!: string;
  public publishDate!: Date;
  public cityId!: string;
  public isFavorite!: boolean;
  public isPremium!: boolean;
  public type!: OfferType;
  public bedrooms!: number;
  public maxAdults!: number;
  public price!: number;
  public goods!: string[];
  public hostId!: string;
  public longitude!: number;
  public latitude!: number;
}
