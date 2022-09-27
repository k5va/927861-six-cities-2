import typegoose, {getModelForClass, defaultClasses} from '@typegoose/typegoose';

const {prop, modelOptions} = typegoose;

export interface GoodEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'goods'
  }
})
export class GoodEntity extends defaultClasses.TimeStamps {
  @prop({ unique: true, required: true })
  public name!: string;
}

export const GoodModel = getModelForClass(GoodEntity);
