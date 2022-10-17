import { Expose, Type } from 'class-transformer';
import UserResponse from '../../user/response/user.response.js';

export default class CommentResponse {
  @Expose()
  public text!: string;

  @Expose()
  public publishDate!: Date;

  @Expose()
  public rating!: number;

  @Expose({ name: 'userId'})
  @Type(() => UserResponse)
  public user!: UserResponse;
}
