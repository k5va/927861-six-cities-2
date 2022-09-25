import {User} from '../../types/index.js';
import typegoose, {getModelForClass, defaultClasses} from '@typegoose/typegoose';
import { createSHA256 } from '../../utils/index.js';

const {prop, modelOptions} = typegoose;

export interface UserEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'users'
  }
})
export class UserEntity extends defaultClasses.TimeStamps implements User {

  constructor(data: User) {
    super();

    this.email = data.email;
    this.name = data.name;
    this.avatarUrl = data.avatarUrl;
    this.isPro = data.isPro;
  }

  @prop({ required: true })
  public name: string;

  @prop({ unique: true, required: true })
  public email: string;

  @prop({ required: true })
  public password!: string;

  @prop({ required: true })
  public avatarUrl: string;

  @prop({ required: true, default: false })
  public isPro: boolean;

  public setPassword(password: string, salt: string) {
    this.password =  createSHA256(password, salt);
  }

  public getPassword() {
    return this.password;
  }
}

export const UserModel = getModelForClass(UserEntity);
