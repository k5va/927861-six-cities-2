import { inject, injectable } from 'inversify';
import mongoose from 'mongoose';
import { Component } from '../../types';
import { LoggerInterface } from '../logger/logger.interface';
import { DatabaseInterface } from './database.interface';

@injectable()
export default class DatabaseService implements DatabaseInterface {

  constructor(@inject(Component.LoggerInterface) private logger: LoggerInterface)
  {}

  public async connect(uri: string): Promise<void> {
    this.logger.info('Trying to connect to DB...');
    await mongoose.connect(uri);
    this.logger.info('Connected to DB');
  }

  public async disconnect(): Promise<void> {
    await mongoose.disconnect();
    this.logger.info('DB connection closed');
  }

}
