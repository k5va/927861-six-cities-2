import * as core from 'express-serve-static-core';
import { Controller, LoggerInterface, ValidateObjectIdMiddleware,
  DocumentExistsMiddleware, PrivateRouteMiddleware } from '../../common/index.js';
import { inject, injectable } from 'inversify';
import { Component, HttpMethod } from '../../types/index.js';
import { Request, Response } from 'express';
import { OfferServiceInterface } from '../offer/offer-service.interface.js';
import { fillDTO } from '../../utils/index.js';
import OfferShortResponse from '../offer/response/offer-short.response.js';
import { FavoritesAction } from './favorites.const.js';
import { UpdateParams } from './favorites.types.js';

@injectable()
export default class FavoritesController extends Controller {
  constructor(
    @inject(Component.LoggerInterface) logger: LoggerInterface,
    @inject(Component.OfferServiceInterface) private readonly offerService: OfferServiceInterface,
  ) {
    super(logger);

    this.logger.info('Registering routes for FavoritesController…');
    this.addRoute({
      path: '/',
      method: HttpMethod.Get,
      handler: this.index,
      middlewares: [
        new PrivateRouteMiddleware(),
      ]
    });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Post,
      handler: this.update,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
      ]
    });
  }

  public async update(
    {params, query, user}: Request<core.ParamsDictionary | UpdateParams>,
    res: Response,
  ): Promise<void> {

    const {id: userId} = user;
    const {offerId} = params;

    const action = query.action ? Number(query.action) : FavoritesAction.Remove;

    let offer;
    if (action === FavoritesAction.Add) {
      offer = await this.offerService.addToFavorites(offerId, userId);
    } else {
      offer = await this.offerService.removeFromFavorites(offerId, userId);
    }
    this.logger.info(`Offer with id ${offerId} updated favorites status ${action} by user ${userId}`);
    offer?.setIsFavorite(userId);
    this.ok(res, fillDTO(OfferShortResponse, offer));
  }

  public async index({user}: Request, res: Response): Promise<void> {
    const {id: userId} = user;

    this.logger.info(`Getting favorites for userid ${userId} `);
    const offers = await this.offerService.findFavoritesByUser(userId);
    offers.forEach((offer) => offer.setIsFavorite(userId));
    this.ok(res, fillDTO(OfferShortResponse, offers));
  }
}
