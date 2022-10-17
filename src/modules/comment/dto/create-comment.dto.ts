import { IsDateString, Max, MaxLength,
  Min, MinLength, IsNumber } from 'class-validator';
import { CommentLength, Rating } from '../../../const/index.js';

export default class CreateCommentDto {
  @MinLength(CommentLength.Min, {message: `Minimum text length must be ${CommentLength.Min}`})
  @MaxLength(CommentLength.Max, {message: `Maximum text length must be ${CommentLength.Max}`})
  public text!: string;

  @IsDateString({}, {message: 'publishDate must be valid ISO date'})
  public publishDate!: Date;

  @IsNumber({}, {message: 'rating must be a number'})
  @Min(Rating.Min, {message: `Minimum maxAdults is ${Rating.Min}`})
  @Max(Rating.Max, {message: `Maximum maxAdults is ${Rating.Max}`})
  public rating!: number;

  public userId!: string;

  public offerId!: string;
}
