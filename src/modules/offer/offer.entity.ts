import typegoose, {getModelForClass, defaultClasses, Ref} from '@typegoose/typegoose';
import { Bedrooms, MaxAdults, Price, Rating, TitleLength, DescriptionLength } from '../../const/index.js';
import { OfferType } from '../../types/index.js';
import { CityEntity } from '../city/city.entity.js';
import { GoodEntity } from '../good/good.entity.js';
import { UserEntity } from '../user/user.entity.js';

const {prop, modelOptions} = typegoose;

export interface OfferEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'offers'
  }
})
export class OfferEntity extends defaultClasses.TimeStamps {
  @prop({ required: true, minlength: TitleLength.min, maxlength: TitleLength.max })
  public title!: string;

  @prop({ required: true, minlength: DescriptionLength.min, maxlength: DescriptionLength.max })
  public description!: string;

  @prop({ required: true})
  public publishDate!: Date;

  @prop({ ref: CityEntity, required: true })
  public cityId!: Ref<CityEntity>;

  @prop({ required: true})
  public previewImage!: string;

  @prop({ required: true, type: String, default: [] })
  public images!: string[];

  @prop({ required: true, default: false })
  public isFavorite!: boolean;

  @prop({ required: true, type: String, default: [] })
  public inFavorites!: string[];

  @prop({ required: true, default: false })
  public isPremium!: boolean;

  @prop({ required: true, min: Rating.min, max: Rating.max })
  public rating!: number;

  @prop({ required: true, type: () => String, enum: OfferType })
  public type!: OfferType;

  @prop({ required: true, min: Bedrooms.min, max: Bedrooms.max })
  public bedrooms!: number;

  @prop({ required: true, min: MaxAdults.min, max: MaxAdults.max })
  public maxAdults!: number;

  @prop({ required: true, min: Price.min, max: Price.max })
  public price!: number;

  @prop({ ref: GoodEntity, required: true, default: [], _id: false })
  public goods!: Ref<GoodEntity>[];

  @prop({ ref: UserEntity, required: true })
  public hostId!: Ref<UserEntity>;

  @prop({ required: true })
  public longitude!: number;

  @prop({ required: true })
  public latitude!: number;

  @prop({default: 0})
  public commentCount!: number;
}

export const OfferModel = getModelForClass(OfferEntity);
