import UserResponse from '../../user/response/user.response.js';

export default class CommentResponse {
  public id!: string;
  public text!: string;
  public publishDate!: Date;
  public rating!: number;
  public user!: UserResponse;
}
