import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { CityEntity } from './city.entity.js';
import { DocumentType, types } from '@typegoose/typegoose';
import CreateCityDto from './dto/create-city.dto.js';
import { CityServiceInterface } from './city-service.interface.js';
import { LoggerInterface } from '../../common/logger/logger.interface.js';
import { Component } from '../../types/index.js';

@injectable()
export default class CityService implements CityServiceInterface {
  constructor(
    @inject(Component.LoggerInterface) private logger: LoggerInterface,
    @inject(Component.CityModel) private readonly cityModel: types.ModelType<CityEntity>
  ) {}

  public async create(dto: CreateCityDto): Promise<DocumentType<CityEntity>> {
    const result = await this.cityModel.create(dto);
    this.logger.info(`New good created: ${dto.name}`);

    return result;
  }

  public async findByName(name: string): Promise<DocumentType<CityEntity> | null> {
    return this.cityModel.findOne({name});
  }

  public async findOrCreate(dto: CreateCityDto): Promise<DocumentType<CityEntity>> {
    const good = await this.findByName(dto.name);
    return good ? good : this.create(dto);
  }
}
