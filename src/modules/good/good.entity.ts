import {Good} from '../../types/index.js';
import typegoose, {getModelForClass, defaultClasses} from '@typegoose/typegoose';

const {prop, modelOptions} = typegoose;

export interface GoodEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'goods'
  }
})
export class GoodEntity extends defaultClasses.TimeStamps implements Good {

  constructor(data: Good) {
    super();

    this.name = data.name;
  }

  @prop({ unique: true, required: true })
  public name: string;
}

export const GoodModel = getModelForClass(GoodEntity);
