import typegoose, {getModelForClass, defaultClasses, Ref} from '@typegoose/typegoose';
import { Bedrooms, MaxAdults, Price, TitleLength, DescriptionLength } from '../../const/index.js';
import { OfferType } from '../../types/index.js';
import { CityEntity } from '../city/city.entity.js';
import { GoodEntity } from '../good/good.entity.js';
import { UserEntity } from '../user/user.entity.js';
import { DEFAULT_OFFER_IMG } from './offer.const.js';

const {prop, modelOptions} = typegoose;

export interface OfferEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'offers'
  }
})
export class OfferEntity extends defaultClasses.TimeStamps {
  @prop({ required: true, minlength: TitleLength.Min, maxlength: TitleLength.Max })
  public title!: string;

  @prop({ required: true, minlength: DescriptionLength.Min, maxlength: DescriptionLength.Max })
  public description!: string;

  @prop({ required: true})
  public publishDate!: Date;

  @prop({ ref: CityEntity, required: true })
  public cityId!: Ref<CityEntity>;

  @prop({ default: DEFAULT_OFFER_IMG})
  public previewImage!: string;

  @prop({ type: String, default: [] })
  public images!: string[];

  @prop({ required: true, default: false })
  public isFavorite!: boolean;

  @prop({ ref: UserEntity, required: true, default: [] })
  public inFavorites!: Ref<UserEntity>[];

  @prop({ required: true, default: false })
  public isPremium!: boolean;

  @prop({ required: true, default: 0 })
  public rating!: number;

  @prop({ required: true, type: () => String, enum: OfferType })
  public type!: OfferType;

  @prop({ required: true, min: Bedrooms.Min, max: Bedrooms.Max })
  public bedrooms!: number;

  @prop({ required: true, min: MaxAdults.Min, max: MaxAdults.Max })
  public maxAdults!: number;

  @prop({ required: true, min: Price.Min, max: Price.Max })
  public price!: number;

  @prop({ ref: GoodEntity, required: true, default: [], _id: false })
  public goods!: Ref<GoodEntity>[];

  @prop({ ref: UserEntity, required: true })
  public hostId!: Ref<UserEntity>;

  @prop({ required: true })
  public longitude!: number;

  @prop({ required: true })
  public latitude!: number;

  @prop({ default: 0 })
  public commentCount!: number;

  setIsFavorite(userId: string) {
    this.isFavorite = userId
      ? this.inFavorites.some((objectId) => objectId?.toString() === userId)
      : false;
  }
}

export const OfferModel = getModelForClass(OfferEntity);
