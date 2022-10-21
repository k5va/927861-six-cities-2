import { Expose } from 'class-transformer';

export default class LoggedInUserResponse {
  @Expose()
  public email!: string ;

  @Expose()
  public name!: string ;

  @Expose()
  public avatarUrl!: string ;

  @Expose()
  public token!: string;
}
