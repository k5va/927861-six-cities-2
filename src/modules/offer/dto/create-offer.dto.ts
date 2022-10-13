import { OfferType } from '../../../types/index.js';

import { IsDateString, IsEnum, IsInt, IsMongoId, Max, MaxLength,
  Min, MinLength, IsBoolean, IsNumber, IsArray } from 'class-validator';
import { DescriptionLength, TitleLength, Bedrooms, MaxAdults, Price } from '../../../const/index.js';

export default class CreateOfferDto {
  @MinLength(TitleLength.Min, {message: `Minimum title length must be ${TitleLength.Min}`})
  @MaxLength(TitleLength.Max, {message: `Maximum title length must be ${TitleLength.Max}`})
  public title!: string;

  @MinLength(DescriptionLength.Min, {message: `Minimum description length must be ${DescriptionLength.Min}`})
  @MaxLength(DescriptionLength.Max, {message: `Maximum description length must be ${DescriptionLength.Max}`})
  public description!: string;

  @IsDateString({}, {message: 'publishDate must be valid ISO date'})
  public publishDate!: Date;

  @IsMongoId({message: 'cityId must be a valid id'})
  public cityId!: string;

  public previewImage!: string;

  @IsArray({message: 'images must be an array'})
  public images!: string[];

  @IsBoolean({ message: 'isFavorite must be boolean'})
  public isFavorite!: boolean;

  @IsBoolean({ message: 'isPremium must be boolean'})
  public isPremium!: boolean;

  @IsEnum(OfferType, {message: `type must be in ${Object.keys(OfferType)}`})
  public type!: OfferType;

  @IsInt({message: 'Bedrooms must be an integer'})
  @Min(Bedrooms.Min, {message: `Minimum bedrooms is ${Bedrooms.Min}`})
  @Max(Bedrooms.Max, {message: `Maximum bedrooms is ${Bedrooms.Max}`})
  public bedrooms!: number;

  @IsInt({message: 'maxAdults must be an integer'})
  @Min(MaxAdults.Min, {message: `Minimum maxAdults is ${MaxAdults.Min}`})
  @Max(MaxAdults.Max, {message: `Maximum maxAdults is ${MaxAdults.Max}`})
  public maxAdults!: number;

  @IsNumber({}, {message: 'price must be a number'})
  @Min(Price.Min, {message: `Minimum maxAdults is ${Price.Min}`})
  @Max(Price.Max, {message: `Maximum maxAdults is ${Price.Max}`})
  public price!: number;

  @IsArray({message: 'goods must be an array'})
  @IsMongoId({each: true, message: 'goods must be an array of valid ObjectId'})
  public goods!: string[];

  @IsMongoId({message: 'hostId must be a valid id'})
  public hostId!: string;

  @IsNumber({}, {message: 'longitude must be a number'})
  public longitude!: number;

  @IsNumber({}, {message: 'latitude must be a number'})
  public latitude!: number;
}
