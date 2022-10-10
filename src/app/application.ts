import { inject, injectable } from 'inversify';
import express, { Express } from 'express';
import { ConfigInterface, ControllerInterface, DatabaseInterface, ExceptionFilterInterface,
  LoggerInterface } from '../common/index.js';
import { Component } from '../types/index.js';
import { getURI } from '../utils/index.js';

@injectable()
export default class Application {
  private readonly expressApp: Express = express();

  constructor(
    @inject(Component.LoggerInterface) private logger: LoggerInterface,
    @inject(Component.ConfigInterface) private config: ConfigInterface,
    @inject(Component.DatabaseInterface) private dbClient: DatabaseInterface,
    @inject(Component.ExceptionFilter) private exceptionFilter: ExceptionFilterInterface,
    @inject(Component.UserController) private userController: ControllerInterface,
    @inject(Component.OfferController) private offerController: ControllerInterface,
  )
  {}

  private initRoutes() {
    this.expressApp.use('/users', this.userController.router);
    this.expressApp.use('/offers', this.offerController.router);
  }

  private initMiddleware() {
    this.expressApp.use(express.json());
  }

  private initExceptionFilters() {
    this.expressApp.use(this.exceptionFilter.catch.bind(this.exceptionFilter));
  }


  /**
   * Initializes application
   */
  public async init() {
    this.logger.info('App initialized!');
    this.logger.info(`Get value from env $PORT: ${this.config.get('PORT')}`);

    const uri = getURI(
      this.config.get('DB_USER'),
      this.config.get('DB_PASSWORD'),
      this.config.get('DB_HOST'),
      this.config.get('DB_PORT'),
      this.config.get('DB_NAME'),
    );

    await this.dbClient.connect(uri);

    this.initMiddleware();
    this.initRoutes();
    this.initExceptionFilters();
    this.expressApp.listen(this.config.get('PORT'));
    this.logger.info(`Server started on http://localhost:${this.config.get('PORT')}`);
  }
}
