import * as core from 'express-serve-static-core';
import { Controller, LoggerInterface, ValidateObjectIdMiddleware,
  ValidateDtoMiddleware, DocumentExistsMiddleware, PrivateRouteMiddleware, HttpError } from '../../common/index.js';
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
import { DeleteParams, IndexQuery, ShowParams, UpdateParams } from './offer.types.js';

@injectable()
export default class OfferController extends Controller {
  constructor(
    @inject(Component.LoggerInterface) logger: LoggerInterface,
    @inject(Component.OfferServiceInterface) private readonly offerService: OfferServiceInterface,
  ) {
    super(logger);

    this.logger.info('Registering routes for OfferController…');
    this.addRoute({
      path: '/',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateDtoMiddleware(CreateOfferDto)
      ]
    });
    this.addRoute({ path: '/', method: HttpMethod.Get, handler: this.index });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Get,
      handler: this.show,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
      ]
    });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Patch,
      handler: this.update,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new ValidateDtoMiddleware(UpdateOfferDto),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
      ]
    });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Delete,
      handler: this.delete,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
      ]
    });
  }

  public async create(
    {body, user}: Request<Record<string, unknown>, Record<string, unknown>, CreateOfferDto>,
    res: Response,
  ): Promise<void> {

    const offer = await this.offerService.create({...body, hostId: user.id});
    this.send(res, StatusCodes.CREATED, fillDTO(OfferResponse, offer));
  }

  public async update(
    {body, params, user}: Request<core.ParamsDictionary | UpdateParams, Record<string, unknown>, UpdateOfferDto>,
    res: Response,
  ): Promise<void> {

    const {id: userId} = user;
    const {offerId} = params;

    await this.checkUserOfferPermission(userId, offerId);
    const offer = await this.offerService.update(offerId, body);
    this.ok(res, fillDTO(OfferResponse, offer));
  }

  public async delete(
    {params, user}: Request<core.ParamsDictionary | DeleteParams>,
    res: Response
  ): Promise<void> {

    const {id: userId} = user;
    const {offerId} = params;

    await this.checkUserOfferPermission(userId, offerId);
    await this.offerService.delete(params.offerId);
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
    this.ok(res, fillDTO(OfferResponse, offer));
  }

  private async checkUserOfferPermission(userId: string, offerId: string): Promise<void> {

    const offer = await this.offerService.findById(offerId);
    if (userId !== offer?.hostId?.id) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        `User ${userId} is not allowed to update / delete offer ${offerId}`,
        'OfferController');
    }
  }
}
