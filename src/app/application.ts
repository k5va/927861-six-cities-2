import { inject, injectable } from 'inversify';
import { ConfigInterface } from '../common/config/config.interface';
import { DatabaseInterface } from '../common/database-client/database.interface';
import { LoggerInterface } from '../common/logger/logger.interface';
import { Component } from '../types/index.js';
import { getURI } from '../utils/index.js';

@injectable()
export default class Application {

  constructor(
    @inject(Component.LoggerInterface) private logger: LoggerInterface,
    @inject(Component.ConfigInterface) private config: ConfigInterface,
    @inject(Component.DatabaseInterface) private dbClient: DatabaseInterface)
  {}

  /**
   * Initializes application
   */
  public async init() {
    this.logger.info('App initialized!');

    const uri = getURI(
      this.config.get('DB_USER'),
      this.config.get('DB_PASSWORD'),
      this.config.get('DB_HOST'),
      this.config.get('DB_PORT'),
      this.config.get('DB_NAME'),
    );

    await this.dbClient.connect(uri);
  }
}
