import { OfferType } from '../../../types/index.js';
import { IsEnum, IsInt, IsMongoId, Max, MaxLength,
  Min, MinLength, IsBoolean, IsNumber, IsArray, IsOptional, IsUrl } from 'class-validator';
import { DescriptionLength, TitleLength, Bedrooms, MaxAdults, Price } from '../../../const/index.js';

export default class UpdateOfferDto {
  @IsOptional()
  @MinLength(TitleLength.Min, {message: `Minimum title length must be ${TitleLength.Min}`})
  @MaxLength(TitleLength.Max, {message: `Maximum title length must be ${TitleLength.Max}`})
  public title?: string;

  @IsOptional()
  @MinLength(DescriptionLength.Min, {message: `Minimum description length must be ${DescriptionLength.Min}`})
  @MaxLength(DescriptionLength.Max, {message: `Maximum description length must be ${DescriptionLength.Max}`})
  public description?: string;

  @IsOptional()
  @IsMongoId({message: 'cityId must be a valid id'})
  public cityId?: string;

  @IsOptional()
  @IsUrl({message: 'Should be valid URL string'})
  public previewImage?: string;

  @IsOptional()
  @IsArray({message: 'images must be an array of URL'})
  public images?: string[];

  @IsOptional()
  @IsBoolean({ message: 'isPremium must be boolean'})
  public isPremium?: boolean;

  @IsOptional()
  @IsEnum(OfferType, {message: `type must be in ${Object.keys(OfferType)}`})
  public type?: OfferType;

  @IsOptional()
  @IsInt({message: 'Bedrooms must be an integer'})
  @Min(Bedrooms.Min, {message: `Minimum bedrooms is ${Bedrooms.Min}`})
  @Max(Bedrooms.Max, {message: `Maximum bedrooms is ${Bedrooms.Max}`})
  public bedrooms?: number;

  @IsOptional()
  @IsInt({message: 'maxAdults must be an integer'})
  @Min(MaxAdults.Min, {message: `Minimum maxAdults is ${MaxAdults.Min}`})
  @Max(MaxAdults.Max, {message: `Maximum maxAdults is ${MaxAdults.Max}`})
  public maxAdults?: number;

  @IsOptional()
  @IsNumber({}, {message: 'price must be a number'})
  @Min(Price.Min, {message: `Minimum maxAdults is ${Price.Min}`})
  @Max(Price.Max, {message: `Maximum maxAdults is ${Price.Max}`})
  public price?: number;

  @IsOptional()
  @IsArray({message: 'goods must be an array'})
  @IsMongoId({each: true, message: 'goods must be an array of valid ObjectId'})
  public goods?: string[];

  @IsOptional()
  @IsNumber({}, {message: 'longitude must be a number'})
  public longitude?: number;

  @IsOptional()
  @IsNumber({}, {message: 'latitude must be a number'})
  public latitude?: number;
}
