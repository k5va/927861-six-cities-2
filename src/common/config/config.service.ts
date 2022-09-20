import { ConfigInterface } from './config.interface';
import { config, DotenvParseOutput } from 'dotenv';
import { LoggerInterface } from '../logger/logger.interface';
import { inject, injectable } from 'inversify';
import { Component } from '../../types/index.js';

@injectable()
export default class ConfigService implements ConfigInterface {
  private config: DotenvParseOutput;

  constructor(@inject(Component.LoggerInterface) private logger: LoggerInterface) {

    const parsedOutput = config();

    if (parsedOutput.error) {
      throw new Error('Can\'t read .env file. Perhaps the file does not exists.');
    }

    this.config = <DotenvParseOutput>parsedOutput.parsed;
    this.logger.info('.env file found and successfully parsed!');
  }

  get(key: string): string | undefined {
    return this.config[key];
  }
}
