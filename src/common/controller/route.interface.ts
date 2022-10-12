import { HttpMethod } from '../../types/index.js';
import { NextFunction, Request, Response } from 'express';
import { MiddlewareInterface } from '../middleware/middleware.interface.js';

export interface RouteInterface {
  path: string;
  method: HttpMethod;
  handler: (req: Request, res: Response, next: NextFunction) => void;
  middlewares?: MiddlewareInterface[];
}
