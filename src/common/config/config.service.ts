import { ConfigInterface } from './config.interface';
import { config } from 'dotenv';
import { LoggerInterface } from '../logger/logger.interface';
import { inject, injectable } from 'inversify';
import { Component } from '../../types/index.js';
import {configSchema, ConfigSchema} from './config.schema.js';

@injectable()
export default class ConfigService implements ConfigInterface {
  private config: ConfigSchema;

  constructor(@inject(Component.LoggerInterface) private logger: LoggerInterface) {

    const parsedOutput = config();

    if (parsedOutput.error) {
      throw new Error('Can\'t read .env file. Perhaps the file does not exists.');
    }

    configSchema.load({}); // read values from env
    configSchema.validate({allowed: 'strict', output: this.logger.info}); // validate loaded values
    this.config = configSchema.getProperties(); // create corresponding object

    this.logger.info('.env file found and successfully parsed!');
  }

  public get<T extends keyof ConfigSchema>(key: T): ConfigSchema[T] {
    return this.config[key];
  }
}
