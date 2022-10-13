import mongoose from 'mongoose';
import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { MiddlewareInterface } from './middleware.interface.js';
import HttpError from '../errors/http-error.js';

const {Types} = mongoose;

export default class ValidateObjectIdMiddleware implements MiddlewareInterface {
  constructor(private param: string) {}

  public execute({params}: Request, _res: Response, next: NextFunction): void {
    const objectId = params[this.param];

    if (Types.ObjectId.isValid(objectId)) {
      return next();
    }

    throw new HttpError(
      StatusCodes.BAD_REQUEST,
      `${objectId} is invalid ObjectID`,
      'ValidateObjectIdMiddleware'
    );
  }
}
