import { Controller, LoggerInterface } from '../../common/index.js';
import { inject, injectable } from 'inversify';
import { Component, HttpMethod } from '../../types/index.js';
import { Request, Response } from 'express';
import { OfferServiceInterface } from './offer-service.interface.js';
import { fillDTO } from '../../utils/index.js';
import OfferShortResponse from './response/offer-short.response.js';

@injectable()
export default class PremiumsController extends Controller {
  constructor(
    @inject(Component.LoggerInterface) logger: LoggerInterface,
    @inject(Component.OfferServiceInterface) private readonly offerService: OfferServiceInterface,
  ) {
    super(logger);

    this.logger.info('Registering routes for PremiumsController…');
    this.addRoute({ path: '/:cityId', method: HttpMethod.Get, handler: this.getPremiums });
  }

  public async getPremiums(
    {params}: Request,
    res: Response): Promise<void> {

    const offers = await this.offerService.findPremiumByCity(params.cityId);
    this.ok(res, fillDTO(OfferShortResponse, offers));
  }
}