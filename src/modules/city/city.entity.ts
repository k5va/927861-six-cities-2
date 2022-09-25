import {City} from '../../types/index.js';
import typegoose, {getModelForClass, defaultClasses} from '@typegoose/typegoose';

const {prop, modelOptions} = typegoose;

const DEFAULT_LATITUDE = 0;
const DEFAULT_LONGITUDE = 0;

export interface CityEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'cities'
  }
})
export class CityEntity extends defaultClasses.TimeStamps implements City {

  constructor(data: City) {
    super();

    this.name = data.name;
    this.longitude = data.longitude;
    this.latitude = data.latitude;
  }

  @prop({ unique: true, required: true })
  public name: string;

  @prop({ required: true, default: DEFAULT_LATITUDE })
  public latitude?: number;

  @prop({ required: true, default: DEFAULT_LONGITUDE })
  public longitude?: number;
}

export const CityModel = getModelForClass(CityEntity);
