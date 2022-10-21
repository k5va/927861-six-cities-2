import { Length } from 'class-validator';
import { UserNameLength } from '../../../const/index.js';

export default class UpdateUserDto {
  @Length(
    UserNameLength.Min, UserNameLength.Max,
    {message: `Min length for password is ${UserNameLength.Min}, max is ${UserNameLength.Max}`}
  )
  public name?: string;

  public avatarUrl?: string;
}
