import { DocumentType } from '@typegoose/typegoose';
import { CommentEntity } from './comment.entity.js';
import CreateCommentDto from './dto/create-comment.dto.js';

export interface CommentServiceInterface {
  create(offerId: string, dto: CreateCommentDto): Promise<DocumentType<CommentEntity>>;
  findByOfferId(offerId: string): Promise<DocumentType<CommentEntity>[] | null>;
  findAllByOfferId(offerId: string): Promise<DocumentType<CommentEntity>[] | null>;
  deleteAllByOfferId(offerId: string): Promise<void>;
}
