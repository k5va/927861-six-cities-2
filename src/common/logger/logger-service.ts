import { LoggerInterface } from './logger.interface';
import pino, {Logger} from 'pino';
import { injectable } from 'inversify';

@injectable()
export default class LoggerService implements LoggerInterface {
  private logger: Logger;

  /**
   * Creates new instance of logger service
   */
  constructor() {
    this.logger = pino();
  }

  info(msg: string, ...args: unknown[]): void {
    this.logger.info(msg, ...args);
  }

  warn(msg: string, ...args: unknown[]): void {
    this.logger.warn(msg, ...args);
  }

  error(msg: string, ...args: unknown[]): void {
    this.logger.error(msg, ...args);
  }

  debug(msg: string, ...args: unknown[]): void {
    this.logger.debug(msg, ...args);
  }
}
