import { DocumentType } from '@typegoose/typegoose';
import { CommentEntity } from '../comment/comment.entity.js';
import CreateCommentDto from '../comment/dto/create-comment.dto.js';
import CreateOfferDto from './dto/create-offer.dto.js';
import UpdateOfferDto from './dto/update-offer.dto.js';
import { OfferEntity } from './offer.entity.js';

export interface OfferServiceInterface {
  create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>>;
  findById(id: string): Promise<DocumentType<OfferEntity> | null>;
  update(id: string, dto: UpdateOfferDto): Promise<DocumentType<OfferEntity> | null>;
  delete(id: string): Promise<DocumentType<OfferEntity> | null>;
  find(count?: number): Promise<DocumentType<OfferEntity>[]>;
  findPremiumByCity(cityId: string): Promise<DocumentType<OfferEntity>[]>;
  findFavoritesByUser(userId: string): Promise<DocumentType<OfferEntity>[]>;
  addToFavorites(id: string, userId: string): Promise<DocumentType<OfferEntity> | null>;
  removeFromFavorites(id: string, userId: string): Promise<DocumentType<OfferEntity> | null>;
  addComment(dto: CreateCommentDto): Promise<DocumentType<CommentEntity> | null>;
}
