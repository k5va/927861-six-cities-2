import { Expose } from 'class-transformer';

export default class GoodResponse {
  @Expose()
  public id!: string;

  @Expose()
  public name!: string;
}
