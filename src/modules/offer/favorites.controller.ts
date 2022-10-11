import { Controller, LoggerInterface, HttpError } from '../../common/index.js';
import { inject, injectable } from 'inversify';
import { Component, HttpMethod } from '../../types/index.js';
import { Request, Response } from 'express';
import { OfferServiceInterface } from './offer-service.interface.js';
import { StatusCodes } from 'http-status-codes';
import { fillDTO } from '../../utils/index.js';
import OfferShortResponse from './response/offer-short.response.js';
import { FavoritesAction } from './offer.const.js';
import { OfferEntity } from './offer.entity.js';

@injectable()
export default class FavoritesController extends Controller {
  constructor(
    @inject(Component.LoggerInterface) logger: LoggerInterface,
    @inject(Component.OfferServiceInterface) private readonly offerService: OfferServiceInterface,
  ) {
    super(logger);

    this.logger.info('Registering routes for FavoritesController…');
    this.addRoute({ path: '/', method: HttpMethod.Get, handler: this.getFavorites });
    this.addRoute({ path: '/:offerId', method: HttpMethod.Post, handler: this.setFavorites });
  }

  public async setFavorites(
    {params, query, headers}: Request<Record<string, string>, Record<string, unknown>,
    Record<string, unknown>>,
    res: Response,
  ): Promise<void> {

    const userId = headers['x-userid'] as string; // TODO: temporary!
    const {offerId} = params;
    const action = query.action ? Number(query.action) : FavoritesAction.Remove;

    let offer;
    if (action === FavoritesAction.Add) {
      offer = await this.offerService.addToFavorites(offerId, userId);
    } else {
      offer = await this.offerService.removeFromFavorites(offerId, userId);
    }
    this.checkOfferPresence(offerId, offer);
    this.logger.info(`Offer with id ${offerId} updated favorites status ${action} by user ${userId}`);

    this.ok(res, fillDTO(OfferShortResponse, offer));
  }

  public async getFavorites({headers}: Request, res: Response): Promise<void> {
    const userId = headers['x-userid'] as string; // TODO: temporary!

    this.logger.info(`Getting favorites for userid ${userId} `);
    const offers = await this.offerService.findFavoritesByUser(userId);
    this.ok(res, fillDTO(OfferShortResponse, offers));
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
