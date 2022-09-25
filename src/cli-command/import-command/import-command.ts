import chalk from 'chalk';
import { inject, injectable } from 'inversify';
import { DatabaseInterface } from '../../common/database-client/database.interface.js';
import TSVFileReader from '../../common/file-reader/tsv-file-reader.js';
import { LoggerInterface } from '../../common/logger/logger.interface.js';
import { CityServiceInterface } from '../../modules/city/city-service.interface.js';
import { GoodServiceInterface } from '../../modules/good/good-service.interface.js';
import { OfferServiceInterface } from '../../modules/offer/offer-service.interface.js';
import { UserServiceInterface } from '../../modules/user/user-service.interface.js';
import { Component, Offer } from '../../types/index.js';
import { getURI } from '../../utils/index.js';
import CliCommandInterface from '../cli-command.interface.js';
import CommandNames from '../command-names.enum.js';
import { createOffer } from './create-offer.js';

const DEFAULT_DB_PORT = 27017;
const DEFAULT_USER_PASSWORD = '123456';

@injectable()
export default class ImportCommand implements CliCommandInterface {
  public readonly name = CommandNames.import;

  private salt!: string;

  constructor(
    @inject(Component.DatabaseInterface) private dbClient: DatabaseInterface,
    @inject(Component.OfferServiceInterface) private offerService: OfferServiceInterface,
    @inject(Component.UserServiceInterface) private userService: UserServiceInterface,
    @inject(Component.GoodServiceInterface) private goodService: GoodServiceInterface,
    @inject(Component.CityServiceInterface) private cityService: CityServiceInterface,
    @inject(Component.LoggerInterface) private logger: LoggerInterface,
  ) {}

  /**
   * Executes command
   * @param {string} fileName - file path
   */
  public async execute(fileName: string, login: string, password: string, host: string, dbname: string, salt: string): Promise<void> {
    const fileReader = new TSVFileReader(fileName.trim());
    const uri = getURI(login, password, host, DEFAULT_DB_PORT, dbname);
    this.salt = salt;

    try {
      this.logger.info('Trying to connect to DB');
      await this.dbClient.connect(uri);
      this.logger.info('DB connection established');

      for await (const line of fileReader.read()) {
        const offer = createOffer(line);
        await this.saveOffer(offer);
        this.logger.debug(`Offer saved to DB: ${offer.title}`);
      }
    } catch (err) {

      if (!(err instanceof Error)) {
        throw err;
      }

      this.logger.error(chalk.red(err.message));
    } finally {
      this.dbClient.disconnect();
      this.logger.info('DB connection closed');
    }
  }

  private async saveOffer(offer: Offer): Promise<void> {
    const goods = [];

    const user = await this.userService.findOrCreate({
      ...offer.host,
      password: DEFAULT_USER_PASSWORD
    }, this.salt);

    for (const good of offer.goods) {
      const registeredGood = await this.goodService.findOrCreate({name: good});
      goods.push(registeredGood.id);
    }

    const city = await this.cityService.findOrCreate(offer.city);

    await this.offerService.create({
      ...offer,
      cityId: city.id,
      goods,
      hostId: user.id,
    });
  }
}
