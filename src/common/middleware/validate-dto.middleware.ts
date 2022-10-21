import { NextFunction, Request, Response } from 'express';
import { ClassConstructor, plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { MiddlewareInterface } from './middleware.interface.js';
import { ValidationErrorField } from '../errors/validation-error-field.type.js';
import DtoValidationError from '../errors/dto-validation-error.js';

export default class ValidateDtoMiddleware implements MiddlewareInterface {
  constructor(private dto: ClassConstructor<object>) {}

  public async execute(req: Request, _res: Response, next: NextFunction): Promise<void> {
    const dtoInstance = plainToInstance(this.dto, req.body);
    const errors = await validate(dtoInstance);

    if (errors.length > 0) {
      throw new DtoValidationError(`DTO validation error: ${req.path}`, this.transformErrors(errors));
    }

    next();
  }

  private transformErrors(errors: ValidationError[]): ValidationErrorField[] {
    return errors.map(({property, value, constraints}) => ({
      property,
      value,
      messages: constraints ? Object.values(constraints) : []
    }));
  }
}
