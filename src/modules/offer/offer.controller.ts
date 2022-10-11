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
import { FavoritesAction } from './offer.const.js';
import { OfferEntity } from './offer.entity.js';

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
    this.addRoute({ path: '/:offerId', method: HttpMethod.Get, handler: this.getDetails });
    this.addRoute({ path: '/:offerId', method: HttpMethod.Put, handler: this.update });
    this.addRoute({ path: '/:offerId', method: HttpMethod.Delete, handler: this.delete });
    this.addRoute({ path: '/favorites', method: HttpMethod.Get, handler: this.getFavorites });
    this.addRoute({ path: '/favorites/:offerId', method: HttpMethod.Post, handler: this.setFavorites });
    this.addRoute({ path: '/premiums/:cityId', method: HttpMethod.Get, handler: this.getPremiums });
  }

  public async create(
    {body}: Request<Record<string, unknown>, Record<string, unknown>, CreateOfferDto>,
    res: Response,
  ): Promise<void> {

    const offer = await this.offerService.create(body);
    this.send(res, StatusCodes.CREATED, fillDTO(OfferResponse, offer));
  }

  public async update(
    {body, params}: Request<Record<string, string>, Record<string, unknown>, UpdateOfferDto>,
    res: Response,
  ): Promise<void> {

    const offer = await this.offerService.update(params.offerId, body);
    this.checkOfferPresence(params.offerId, offer);

    this.ok(res, fillDTO(OfferResponse, offer));
  }

  public async delete({params}: Request, res: Response): Promise<void> {

    const offer = await this.offerService.delete(params.offerId);
    this.checkOfferPresence(params.offerId, offer);

    this.noContent(res);
  }

  public async index(
    {query}: Request<Record<string, unknown>, Record<string, unknown>,
    Record<string, unknown>>,
    res: Response,
  ): Promise<void> {

    const count = query.count ? Number(query.count) : undefined;
    const offers = await this.offerService.find(count);
    this.ok(res, fillDTO(OfferShortResponse, offers));
  }

  public async setFavorites(
    {params, query, headers}: Request<Record<string, string>, Record<string, unknown>,
    Record<string, unknown>>,
    res: Response,
  ): Promise<void> {

    const userId = headers['x-userId'] as string; // TODO: temporary!
    const {offerId} = params;
    const action = query.action ? Number(query.action) : FavoritesAction.Remove;

    let offer;
    if (action === FavoritesAction.Add) {
      offer = await this.offerService.addToFavorites(offerId, userId);
    } else {
      offer = await this.offerService.removeFromFavorites(offerId, userId);
    }

    this.checkOfferPresence(offerId, offer);

    this.ok(res, fillDTO(OfferShortResponse, offer));
  }

  public async getFavorites({headers}: Request, res: Response): Promise<void> {
    const userId = headers['x-userId'] as string; // TODO: temporary!
    const offers = await this.offerService.findFavoritesByUser(userId);
    this.ok(res, fillDTO(OfferShortResponse, offers));
  }

  public async getPremiums(
    {params}: Request,
    res: Response): Promise<void> {

    const offers = await this.offerService.findPremiumByCity(params.cityId);
    this.ok(res, fillDTO(OfferShortResponse, offers));
  }

  public async getDetails({params}: Request, res: Response): Promise<void> {
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
