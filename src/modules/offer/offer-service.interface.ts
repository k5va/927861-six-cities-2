import { DocumentType } from '@typegoose/typegoose';
import CreateOfferDto from './dto/create-offer.dto.js';
import UpdateOfferDto from './dto/update-offer.dto.js';
import { OfferEntity } from './offer.entity.js';

export interface OfferServiceInterface {
  create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>>;
  findById(id: string): Promise<DocumentType<OfferEntity> | null>;
  update(id: string, dto: UpdateOfferDto): Promise<DocumentType<OfferEntity> | null>;
  delete(id: string): Promise<DocumentType<OfferEntity> | null>;
  find(): Promise<DocumentType<OfferEntity>[]>;
}
