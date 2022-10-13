import { IsEmail, IsString, Length, IsBoolean, IsOptional } from 'class-validator';
import { PasswordLength, UserNameLength } from '../../../const/index.js';

export default class CreateUserDto {
  @IsString({message: 'name is required'})
  @Length(
    UserNameLength.Min, UserNameLength.Max,
    {message: `Min length for password is ${UserNameLength.Min}, max is ${UserNameLength.Max}`}
  )
  public name!: string;

  @IsEmail({}, {message: 'email must be valid address'})
  public email!: string;

  @IsString({message: 'password is required'})
  @Length(
    PasswordLength.Min,   PasswordLength.Max,
    {message: `Min length for password is ${PasswordLength.Min}, max is ${PasswordLength.Max}`}
  )
  public password!: string;

  @IsBoolean({ message: 'isPro must be boolean'})
  public isPro!: boolean;

  @IsOptional()
  public avatarUrl?: string;
}
