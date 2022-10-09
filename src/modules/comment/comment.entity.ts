import typegoose, {getModelForClass, defaultClasses, Ref} from '@typegoose/typegoose';
import { CommentLength, Rating } from '../../const/index.js';
import { OfferEntity } from '../offer/offer.entity.js';
import { UserEntity } from '../user/user.entity.js';

const {prop, modelOptions} = typegoose;

export interface CommentEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'comments'
  }
})
export class CommentEntity extends defaultClasses.TimeStamps {
  @prop({ required: true, minlength: CommentLength.Min, maxlength: CommentLength.Max })
  public text!: string;

  @prop({ required: true})
  public publishDate!: Date;

  @prop({ required: true, min: Rating.Min, max: Rating.Max })
  public rating!: number;

  @prop({ ref: UserEntity, required: true })
  public userId!: Ref<UserEntity>;

  @prop({ ref: OfferEntity, required: true })
  public offerId!: Ref<OfferEntity>;
}

export const CommentModel = getModelForClass(CommentEntity);
