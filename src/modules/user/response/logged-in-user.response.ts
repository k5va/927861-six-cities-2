import { Expose } from 'class-transformer';

export default class LoggedInUserResponse {
  @Expose()
  public email!: string ;

  @Expose()
  public token!: string;
}
