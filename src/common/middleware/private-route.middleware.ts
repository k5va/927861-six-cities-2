import { NextFunction, Request, Response } from 'express';
import { MiddlewareInterface } from './middleware.interface.js';
import HttpError from '../errors/http-error.js';
import { StatusCodes } from 'http-status-codes';

export default class PrivateRouteMiddleware implements MiddlewareInterface {
  public async execute(req: Request, _res: Response, next: NextFunction): Promise<void> {
    return req.user ? next() : next(new HttpError(
      StatusCodes.UNAUTHORIZED,
      'Unauthorized ',
      'PrivateRouteMiddleware')
    );
  }
}
