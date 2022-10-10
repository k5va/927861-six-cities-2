import { Expose } from 'class-transformer';

export default class CommentResponse {
  @Expose()
  public text!: string;

  @Expose()
  public publishDate!: Date;

  @Expose()
  public rating!: number;

  @Expose()
  public userId!: string;
}
