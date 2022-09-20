import { inject, injectable } from 'inversify';
import { ConfigInterface } from '../common/config/config.interface';
import { LoggerInterface } from '../common/logger/logger.interface';
import { Component } from '../types/index.js';

@injectable()
export default class Application {

  constructor(
    @inject(Component.LoggerInterface) private logger: LoggerInterface,
    @inject(Component.ConfigInterface) private config: ConfigInterface)
  {}

  /**
   * Initializes application
   */
  public init() {
    this.logger.info('App initialized!');
    this.logger.info(`PORT value: ${this.config.get('PORT')}`);
  }
}
