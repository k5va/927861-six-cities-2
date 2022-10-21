import { User } from '../../types/index.js';
import typegoose, {getModelForClass, defaultClasses} from '@typegoose/typegoose';
import { createSHA256 } from '../../utils/index.js';
import { UserNameLength } from '../../const/index.js';
import { DEFAULT_AVATAR_IMG } from './user.const.js';

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

  @prop({ required: true, minlength: UserNameLength.Min, maxlength: UserNameLength.Max })
  public name: string;

  @prop({ unique: true, required: true })
  public email: string;

  @prop({ required: true })
  public password!: string;

  @prop({ required: true, default: DEFAULT_AVATAR_IMG })
  public avatarUrl: string;

  @prop({ required: true, default: false })
  public isPro: boolean;

  public setPassword(password: string, salt: string) {
    this.password =  createSHA256(password, salt);
  }

  public getPassword() {
    return this.password;
  }

  public verifyPassword(password: string, salt: string) {
    const hashPassword = createSHA256(password, salt);
    return hashPassword === this.getPassword();
  }
}

export const UserModel = getModelForClass(UserEntity);
