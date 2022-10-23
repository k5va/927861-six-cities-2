import { MiddlewareInterface} from './middleware.interface.js';
import { NextFunction, Request, Response } from 'express';
import { FindIdByNameInterface } from '../../common/index.js';
import HttpError from '../errors/http-error.js';
import { StatusCodes } from 'http-status-codes';

export default class PopulateIdMiddleware implements MiddlewareInterface {
  constructor(
    private readonly service: FindIdByNameInterface,
    private readonly entityName: string,
    private readonly paramName: string,
    private readonly isInBody: boolean = false,
    private readonly isRequired: boolean = true,
  ) {}

  public async execute({params, body}: Request, _res: Response, next: NextFunction): Promise<void> {

    const name = this.isInBody? body[this.paramName] : params[this.paramName];
    if (!name) {
      if (this.isRequired) {
        throw new HttpError(StatusCodes.NOT_FOUND,
          `${this.entityName} with ${name} not found.`,
          'PopulateIdMiddleware'
        );
      }

      return next();
    }

    if (this.isInBody) {
      body[this.paramName] = name instanceof Array
        ? await this.populateArray(name)
        : await this.populateValue(name);
    } else {
      params[this.paramName] = await this.populateValue(name);
    }

    next();
  }

  private async populateValue(name: string): Promise<string> {

    const id = await this.service.findIdByName(name);
    if (!id) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `${this.entityName} with ${name} not found.`,
        'PopulateIdMiddleware'
      );
    }

    return id;
  }

  private async populateArray(names: string[]): Promise<string[]> {
    return Promise.all(names.map((name) => this.populateValue(name)));
  }
}
