import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { OfferEntity } from './offer.entity.js';
import { DocumentType, types } from '@typegoose/typegoose';
import CreateOfferDto from './dto/create-offer.dto.js';
import { OfferServiceInterface } from './offer-service.interface.js';
import { LoggerInterface } from '../../common/index.js';
import { Component } from '../../types/index.js';
import updateOfferDto from './dto/update-offer.dto.js';
import { DEFAULT_OFFER_COUNT } from './offer.constants.js';

@injectable()
export default class OfferService implements OfferServiceInterface {
  constructor(
    @inject(Component.LoggerInterface) private logger: LoggerInterface,
    @inject(Component.OfferModel) private readonly offerModel: types.ModelType<OfferEntity>
  ) {}

  public async create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>> {
    const result = await this.offerModel.create(dto);
    this.logger.info(`New Offer created: ${dto.title}`);

    return result;
  }

  public async findById(id: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findById(id)
      .populate(['hostId', 'goods'])
      .exec();
  }

  public async delete(id: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findByIdAndDelete(id)
      .exec();
  }

  public async update(id: string, dto: updateOfferDto): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findByIdAndUpdate(id, dto, { new: true })
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
}
