import { DocumentType } from '@typegoose/typegoose';
import { FindIdByNameInterface } from '../../common/index.js';
import CreateGoodDto from './dto/create-good.dto.js';
import { GoodEntity } from './good.entity.js';

export interface GoodServiceInterface extends FindIdByNameInterface {
  create(dto: CreateGoodDto): Promise<DocumentType<GoodEntity>>;
  findByName(name: string): Promise<DocumentType<GoodEntity> | null>;
  findOrCreate(dto: CreateGoodDto): Promise<DocumentType<GoodEntity>>;
}
