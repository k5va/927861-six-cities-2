import { injectable } from 'inversify';
import { Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import asyncHandler from 'express-async-handler';
import { LoggerInterface } from '../logger/logger.interface.js';
import { RouteInterface } from './route.interface.js';
import { ControllerInterface } from './controller.interface.js';
import { TransformerInterface } from '../transformer/transformer.interface.js';
import UrlPathTransformer from '../transformer/url-path-transformer.js';
import { ConfigInterface } from '../config/config.interface.js';
import { SomeObject } from '../../types/index.js';
import getFullServerPath from '../../utils/get-full-server-path.js';

@injectable()
export abstract class Controller implements ControllerInterface {
  private readonly _router: Router;
  private transformers: TransformerInterface[] = [
    new UrlPathTransformer(
      ['avatarUrl', 'previewImage', 'images'],
      `${getFullServerPath(this.config.get('HOST'), this.config.get('PORT'))}/${this.config.get('UPLOAD_DIRECTORY')}`,
      `${getFullServerPath(this.config.get('HOST'), this.config.get('PORT'))}/${this.config.get('STATIC_DIRECTORY')}`
    ),
  ];

  constructor(
    protected readonly logger: LoggerInterface,
    protected readonly config: ConfigInterface,
  ) {
    this._router = Router();
  }

  get router() {
    return this._router;
  }

  public addRoute(route: RouteInterface) {

    const routeHandler = asyncHandler(route.handler.bind(this));
    const middlewares = route.middlewares?.map(
      (middleware) => asyncHandler(middleware.execute.bind(middleware))
    );
    const allHandlers = middlewares ? [...middlewares, routeHandler] : routeHandler;
    this._router[route.method](route.path, allHandlers);
    this.logger.info(`Route registered: ${route.method.toUpperCase()} ${route.path}`);
  }

  public send<T>(res: Response, statusCode: number, data: T): void {
    this.transform(data as SomeObject);
    res
      .type('application/json')
      .status(statusCode)
      .json(data);
  }

  public created<T>(res: Response, data: T): void {
    this.send(res, StatusCodes.CREATED, data);
  }

  public noContent(res: Response): void {
    this.send(res, StatusCodes.NO_CONTENT, null);
  }

  public ok<T>(res: Response, data: T): void {
    this.send(res, StatusCodes.OK, data);
  }

  private transform(data: SomeObject): void {
    this.transformers.forEach((trasformer) => trasformer.transform(data));
  }
}
