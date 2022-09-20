import { ConfigInterface } from './config.interface';

export default class ConfigService implements ConfigInterface {

  private config: NodeJS.ProcessEnv = process.env;

  get(key: string): string | undefined {
    return this.config[key];
  }
}
