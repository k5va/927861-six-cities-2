import * as core from 'express-serve-static-core';
import { Controller, LoggerInterface, ValidateObjectIdMiddleware,
  ValidateDtoMiddleware, DocumentExistsMiddleware, PrivateRouteMiddleware,
  HttpError, ConfigInterface } from '../../common/index.js';
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
import { GoodServiceInterface } from '../good/good-service.interface.js';
import { CityServiceInterface } from '../city/city-service.interface.js';

@injectable()
export default class OfferController extends Controller {
  constructor(
    @inject(Component.LoggerInterface) logger: LoggerInterface,
    @inject(Component.ConfigInterface) config: ConfigInterface,
    @inject(Component.OfferServiceInterface) private readonly offerService: OfferServiceInterface,
    @inject(Component.GoodServiceInterface) private readonly goodService: GoodServiceInterface,
    @inject(Component.CityServiceInterface) private readonly cityService: CityServiceInterface,
  ) {
    super(logger, config);

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

    const cityId = await this.getCityIdByName(body.cityId); // TODO: rename field to city
    const goods = await this.getGoodsIdByNames(body.goods);

    const offer = await this.offerService.create({
      ...body,
      hostId: user.id,
      isFavorite: false,
      goods,
      cityId,
    });
    this.send(res, StatusCodes.CREATED, fillDTO(OfferResponse, offer));
  }

  public async update(
    {body, params, user}: Request<core.ParamsDictionary | UpdateParams, Record<string, unknown>, UpdateOfferDto>,
    res: Response,
  ): Promise<void> {

    const {id: userId} = user;
    const {offerId} = params;

    await this.checkUserOfferPermission(userId, offerId);
    if (body.cityId) {
      const cityId = await this.getCityIdByName(body.cityId);
      body = {...body, cityId};
    }
    if (body.goods) {
      const goods = await this.getGoodsIdByNames(body.goods);
      body = {...body, goods};
    }

    const offer = await this.offerService.update(offerId, body);

    offer?.setIsFavorite(userId);
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
    {query, user}: Request<unknown, unknown, unknown, IndexQuery>,
    res: Response,
  ): Promise<void> {

    const count = query.count ? query.count : undefined;
    this.logger.info(`Getting offers max count ${count}`);
    const offers = await this.offerService.find(count);
    offers.forEach((offer) => offer.setIsFavorite(user?.id));
    this.ok(res, fillDTO(OfferShortResponse, offers));
  }

  public async show(
    {params, user}: Request<core.ParamsDictionary | ShowParams>,
    res: Response
  ): Promise<void> {
    this.logger.info(`Getting details for offer ${params.offerId}`);
    const offer = await this.offerService.findById(params.offerId);
    offer?.setIsFavorite(user?.id);
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

  private async getCityIdByName(name: string): Promise<string> {
    const city = await this.cityService.findByName(name);
    if (!city) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        `City ${name} is not alowed. Please provide a valid city name`,
        'OfferController');
    }

    return city.id;
  }

  private async getGoodsIdByNames(names: string[]): Promise<string[]> {
    const goods = [];
    for (const name of names) {
      const good = await this.goodService.findByName(name);
      if (good) {
        goods.push(good.id);
      } else {
        throw new HttpError(
          StatusCodes.BAD_REQUEST,
          `Good ${name} is not alowed. Please provide a valid good`,
          'OfferController');
      }
    }
    return goods;
  }
}
