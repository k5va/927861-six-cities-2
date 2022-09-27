import { OfferType } from '../../../types/index.js';

export default class CreateOfferDto {
  public title!: string;
  public description!: string;
  public publishDate!: Date;
  public cityId!: string;
  public previewImage!: string;
  public images!: string[];
  public isFavorite!: boolean;
  public isPremium!: boolean;
  public rating!: number;
  public type!: OfferType;
  public bedrooms!: number;
  public maxAdults!: number;
  public price!: number;
  public goods!: string[];
  public hostId!: string;
  public longitude!: number;
  public latitude!: number;
}
