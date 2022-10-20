import * as core from 'express-serve-static-core';
import { ConfigInterface, Controller, DocumentExistsMiddleware, LoggerInterface,
  ValidateObjectIdMiddleware } from '../../common/index.js';
import { inject, injectable } from 'inversify';
import { Component, HttpMethod } from '../../types/index.js';
import { Request, Response } from 'express';
import { OfferServiceInterface } from '../offer/offer-service.interface.js';
import { fillDTO } from '../../utils/index.js';
import OfferShortResponse from '../offer/response/offer-short.response.js';
import { IndexParams } from './premiums.types.js';
import { CityServiceInterface } from '../city/city-service.interface.js';

@injectable()
export default class PremiumsController extends Controller {
  constructor(
    @inject(Component.LoggerInterface) logger: LoggerInterface,
    @inject(Component.ConfigInterface) config: ConfigInterface,
    @inject(Component.OfferServiceInterface) private readonly offerService: OfferServiceInterface,
    @inject(Component.CityServiceInterface) private readonly cityService: CityServiceInterface,
  ) {
    super(logger, config);

    this.logger.info('Registering routes for PremiumsController…');
    this.addRoute({
      path: '/:cityId',
      method: HttpMethod.Get,
      handler: this.index,
      middlewares: [
        new ValidateObjectIdMiddleware('cityId'),
        new DocumentExistsMiddleware(this.cityService, 'City', 'cityId'),
      ]
    });
  }

  public async index(
    {params, user}: Request<core.ParamsDictionary | IndexParams>,
    res: Response): Promise<void> {

    const offers = await this.offerService.findPremiumByCity(params.cityId);
    offers.forEach((offer) => offer.setIsFavorite(user?.id));
    this.ok(res, fillDTO(OfferShortResponse, offers));
  }
}
