import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { OfferEntity } from './offer.entity.js';
import { DocumentType, types } from '@typegoose/typegoose';
import CreateOfferDto from './dto/create-offer.dto.js';
import { OfferServiceInterface } from './offer-service.interface.js';
import { LoggerInterface } from '../../common/index.js';
import { Component } from '../../types/index.js';
import updateOfferDto from './dto/update-offer.dto.js';
import { DEFAULT_OFFER_COUNT, PREMIUM_OFFER_COUNT } from './offer.const.js';
import CreateCommentDto from '../comment/dto/create-comment.dto.js';
import { CommentEntity } from '../comment/comment.entity.js';
import { CommentServiceInterface } from '../comment/comment-service.interface.js';

@injectable()
export default class OfferService implements OfferServiceInterface {
  constructor(
    @inject(Component.LoggerInterface) private logger: LoggerInterface,
    @inject(Component.OfferModel) private readonly offerModel: types.ModelType<OfferEntity>,
    @inject(Component.CommentServiceInterface) private readonly commentService: CommentServiceInterface
  ) {}

  public async create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>> {
    const offer = await this.offerModel.create({...dto, inFavorites: dto.isFavorite ? [dto.hostId] : []});
    this.logger.info(`New Offer created: ${dto.title}`);

    return offer.populate(['hostId', 'goods']);
  }

  public async findById(id: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findById(id)
      .populate(['hostId', 'goods'])
      .exec();
  }

  public async delete(id: string): Promise<DocumentType<OfferEntity> | null> {
    const result = this.offerModel.findByIdAndDelete(id).exec();
    this.commentService.deleteAllByOfferId(id);
    this.logger.info(`Offer ${id} deleted`);

    return result;
  }

  public async addComment(offerId: string, dto: CreateCommentDto): Promise<DocumentType<CommentEntity>> {
    const comment = await this.commentService.create(offerId, dto);
    const offerComments = await this.commentService.findAllByOfferId(offerId);

    const commentCount = offerComments?.length ?? 0;
    const avgRating = commentCount > 0
      ? offerComments?.map(({rating}) => rating).reduce((avg, rating) => avg + rating / commentCount, 0)
      : 0;

    await this.offerModel.findByIdAndUpdate(offerId,
      [
        { $set: { rating:  avgRating } },
        { $set: { commentCount: commentCount } },
      ]
    );

    return comment;
  }

  public async update(id: string, dto: updateOfferDto): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findByIdAndUpdate(id, dto, { new: true })
      .populate(['hostId', 'goods'])
      .exec();
  }

  public async addToFavorites(id: string, userId: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findByIdAndUpdate(id, {'$addToSet': {
        inFavorites: userId,
      }})
      .populate(['hostId', 'goods'])
      .exec();
  }

  public async removeFromFavorites(id: string, userId: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findByIdAndUpdate(id, {'$pull': {
        inFavorites: userId,
      }})
      .populate(['hostId', 'goods'])
      .exec();
  }

  public async find(count: number = DEFAULT_OFFER_COUNT): Promise<DocumentType<OfferEntity>[]> {
    return this.offerModel
      .find()
      .limit(count)
      .populate(['hostId', 'goods'])
      .exec();
  }

  public async findPremiumByCity(cityId: string): Promise<DocumentType<OfferEntity>[]> {
    return this.offerModel
      .find({cityId, isPremium: true})
      .sort({publishDate: 'descending'})
      .limit(PREMIUM_OFFER_COUNT)
      .populate(['hostId', 'goods'])
      .exec();
  }

  public async findFavoritesByUser(userId: string): Promise<DocumentType<OfferEntity>[]> {
    return this.offerModel
      .find({inFavorites: userId})
      .populate(['hostId', 'goods'])
      .exec();
  }

  public async exists(offerId: string): Promise<boolean> {
    return (await this.offerModel.exists({_id: offerId})) !== null;
  }
}
