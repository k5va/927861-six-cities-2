import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { GoodEntity } from './good.entity.js';
import { DocumentType, types } from '@typegoose/typegoose';
import CreateGoodDto from './dto/create-good.dto.js';
import { GoodServiceInterface } from './good-service.interface.js';
import { LoggerInterface } from '../../common/logger/logger.interface.js';
import { Component } from '../../types/index.js';

@injectable()
export default class UserService implements GoodServiceInterface {
  constructor(
    @inject(Component.LoggerInterface) private logger: LoggerInterface,
    @inject(Component.GoodModel) private readonly goodModel: types.ModelType<GoodEntity>
  ) {}

  public async create(dto: CreateGoodDto): Promise<DocumentType<GoodEntity>> {
    const good = new GoodEntity(dto);

    const result = await this.goodModel.create(good);
    this.logger.info(`New good created: ${good.name}`);

    return result;
  }

  public async findByName(name: string): Promise<DocumentType<GoodEntity> | null> {
    return this.goodModel.findOne({email: name});
  }

  public async findOrCreate(dto: CreateGoodDto): Promise<DocumentType<GoodEntity>> {
    const good = await this.findByName(dto.name);
    return good ? good : this.create(dto);
  }
}
