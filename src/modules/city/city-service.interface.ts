import { DocumentType } from '@typegoose/typegoose';
import CreateCityDto from './dto/create-city.dto.js';
import { CityEntity } from './city.entity.js';
import { DocumentExistsInterface, FindIdByNameInterface } from '../../common/index.js';

export interface CityServiceInterface extends DocumentExistsInterface, FindIdByNameInterface {
  create(dto: CreateCityDto): Promise<DocumentType<CityEntity>>;
  findByName(name: string): Promise<DocumentType<CityEntity> | null>;
  findOrCreate(dto: CreateCityDto): Promise<DocumentType<CityEntity>>;
}
