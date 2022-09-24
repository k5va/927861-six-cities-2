import convict from 'convict';
import validator from 'convict-format-with-validator';

convict.addFormats(validator);

export type ConfigSchema = {
  PORT: number;
  SALT: string;
  DB_HOST: string;
  DB_USER: string;
  DB_PASSWORD: string;
  DB_PORT: number;
  DB_NAME: string;
}

export const configSchema = convict<ConfigSchema>({
  PORT: {
    doc: 'Port for incoming connections',
    format: 'port',
    env: 'PORT',
    default: 3000
  },
  SALT: {
    doc: 'Salt for hashing password',
    format: String,
    env: 'SALT',
    default: null
  },
  DB_HOST: {
    doc: 'Database host address',
    format: 'ipaddress',
    env: 'DB_HOST',
    default: '127.0.0.1'
  },
  DB_USER: {
    doc: 'Database user',
    format: String,
    env: 'DB_USER',
    default: null
  },
  DB_PASSWORD: {
    doc: 'Database password',
    format: String,
    env: 'DB_PASSWORD',
    default: null
  },
  DB_PORT: {
    doc: 'Database port',
    format: 'port',
    env: 'DB_PORT',
    default: 27017
  },
  DB_NAME: {
    doc: 'Database name',
    format: String,
    env: 'DB_NAME',
    default: 'six-cities'
  },
});
