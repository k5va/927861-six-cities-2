import { LoggerInterface } from '../common/logger/logger.interface';

export default class Application {

  constructor(private logger: LoggerInterface) {}

  /**
   * Initializes application
   */
  public init() {
    this.logger.info('App initialized!');
  }
}
