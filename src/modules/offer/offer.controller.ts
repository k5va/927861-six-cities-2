import * as core from 'express-serve-static-core';
import { Controller, LoggerInterface, HttpError } from '../../common/index.js';
import { inject, injectable } from 'inversify';
import { Component, HttpMethod } from '../../types/index.js';
import { Request, Response } from 'express';
import CreateOfferDto from './dto/create-offer.dto.js';
import { OfferServiceInterface } from './offer-service.interface.js';
import { StatusCodes } from 'http-status-codes';
import { fillDTO } from '../../utils/index.js';
import OfferResponse from './response/offer.response.js';
import UpdateOfferDto from './dto/update-offer.dto.js';
import OfferShortResponse from './response/offer-short.response.js';
import { OfferEntity } from './offer.entity.js';
import { DeleteParams, IndexQuery, ShowParams, UpdateParams } from './offer.types.js';

@injectable()
export default class OfferController extends Controller {
  constructor(
    @inject(Component.LoggerInterface) logger: LoggerInterface,
    @inject(Component.OfferServiceInterface) private readonly offerService: OfferServiceInterface,
  ) {
    super(logger);

    this.logger.info('Registering routes for OfferController…');
    this.addRoute({ path: '/', method: HttpMethod.Post, handler: this.create });
    this.addRoute({ path: '/', method: HttpMethod.Get, handler: this.index });
    this.addRoute({ path: '/:offerId', method: HttpMethod.Get, handler: this.show });
    this.addRoute({ path: '/:offerId', method: HttpMethod.Put, handler: this.update });
    this.addRoute({ path: '/:offerId', method: HttpMethod.Delete, handler: this.delete });
  }

  public async create(
    {body}: Request<Record<string, unknown>, Record<string, unknown>, CreateOfferDto>,
    res: Response,
  ): Promise<void> {

    const offer = await this.offerService.create(body);
    this.send(res, StatusCodes.CREATED, fillDTO(OfferResponse, offer));
  }

  public async update(
    {body, params}: Request<core.ParamsDictionary | UpdateParams, Record<string, unknown>, UpdateOfferDto>,
    res: Response,
  ): Promise<void> {

    const offer = await this.offerService.update(params.offerId, body);
    this.checkOfferPresence(params.offerId, offer);

    this.ok(res, fillDTO(OfferResponse, offer));
  }

  public async delete(
    {params}: Request<core.ParamsDictionary | DeleteParams>,
    res: Response
  ): Promise<void> {

    const offer = await this.offerService.delete(params.offerId);
    this.checkOfferPresence(params.offerId, offer);

    this.noContent(res);
  }

  public async index(
    {query}: Request<unknown, unknown, unknown, IndexQuery>,
    res: Response,
  ): Promise<void> {

    const count = query.count ? query.count : undefined;
    this.logger.info(`Getting offers max count ${count}`);
    const offers = await this.offerService.find(count);
    this.ok(res, fillDTO(OfferShortResponse, offers));
  }

  public async show(
    {params}: Request<core.ParamsDictionary | ShowParams>,
    res: Response
  ): Promise<void> {
    this.logger.info(`Getting details for offer ${params.offerId}`);

    const offer = await this.offerService.findById(params.offerId);
    this.checkOfferPresence(params.offerId, offer);

    this.ok(res, fillDTO(OfferResponse, offer));
  }

  private checkOfferPresence(offerId: string, offer: OfferEntity | null): void {
    if (!offer) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with id «${offerId}» doesn't exist.`,
        'OfferController'
      );
    }
  }
}
