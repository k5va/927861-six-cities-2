import { inject, injectable } from 'inversify';
import { LoggerInterface } from '../common/logger/logger.interface';
import { Component } from '../types/index.js';

@injectable()
export default class Application {

  constructor(@inject(Component.LoggerInterface) private logger: LoggerInterface) {}

  /**
   * Initializes application
   */
  public init() {
    this.logger.info('App initialized!');
  }
}
