import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { StatusCodes } from 'http-status-codes';
import { ExceptionFilterInterface } from './exception-filter.interface.js';
import { Component } from '../../types/index.js';
import { LoggerInterface } from '../logger/logger.interface.js';
import HttpError from './http-error.js';
import DtoValidationError from './dto-validation-error.js';
import { ValidationErrorField } from './validation-error-field.type.js';
import { ServiceError } from './service-error.enum.js';

@injectable()
export default class ExceptionFilter implements ExceptionFilterInterface {
  constructor(
    @inject(Component.LoggerInterface) private logger: LoggerInterface
  ) {
    this.logger.info('Register ExceptionFilter');
    this.catch = this.catch.bind(this);
  }

  private handleHttpError(error: HttpError, _req: Request, res: Response, _next: NextFunction): void {
    this.logger.error(`[${error.details}]: ${error.httpStatusCode} — ${error.message}`);
    res
      .status(error.httpStatusCode)
      .json(this.createErrorObject(ServiceError.CommonError, error.message));
  }

  private handleDtoValidationError(
    error: DtoValidationError,
    _req: Request,
    res: Response,
    _next: NextFunction): void {

    this.logger.error(`[Validation Error]: ${error.message}`);
    error.details.forEach(
      (errorField) => this.logger.error(`[${errorField.property}] — ${errorField.messages}`)
    );

    res
      .status(error.httpStatusCode)
      .json(this.createErrorObject(ServiceError.DtoValidationError, error.message, error.details));
  }

  private handleOtherError(error: Error, _req: Request, res: Response, _next: NextFunction): void {
    this.logger.error(error.message);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(this.createErrorObject(ServiceError.ServiceError, error.message));
  }

  public catch(
    error: Error | HttpError | DtoValidationError,
    req: Request,
    res: Response,
    next: NextFunction): void {

    switch (error.constructor) {
      case HttpError:
        this.handleHttpError(error as HttpError, req, res, next);
        break;
      case DtoValidationError:
        this.handleDtoValidationError(error as DtoValidationError, req, res, next);
        break;
      case Error:
      default:
        this.handleOtherError(error, req, res, next);
        break;
    }
  }

  private createErrorObject(
    errorType: ServiceError,
    message: string,
    details: ValidationErrorField[] = []) {

    return {
      errorType,
      message,
      details: [...details]
    };
  }
}
