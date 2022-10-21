import * as core from 'express-serve-static-core';
import { Controller, LoggerInterface, ValidateObjectIdMiddleware,
  ValidateDtoMiddleware, DocumentExistsMiddleware, PrivateRouteMiddleware,
  HttpError, ConfigInterface, UploadFileMiddleware } from '../../common/index.js';
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
import { DeleteParams, IndexQuery, ShowParams, UpdateParams,
  UploadPreviewImageParams } from './offer.types.js';
import UploadPreviewImageResponse from './response/upload-preview-image.response.js';
import UploadImagesResponse from './response/upload-images.response.js';

@injectable()
export default class OfferController extends Controller {
  constructor(
    @inject(Component.LoggerInterface) logger: LoggerInterface,
    @inject(Component.ConfigInterface) config: ConfigInterface,
    @inject(Component.OfferServiceInterface) private readonly offerService: OfferServiceInterface,
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
    this.addRoute({
      path: '/:offerId/preview',
      method: HttpMethod.Post,
      handler: this.uploadPreviewImage,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new UploadFileMiddleware(this.config.get('UPLOAD_DIRECTORY'), 'preview'),
      ]
    });

    this.addRoute({
      path: '/:offerId/images',
      method: HttpMethod.Post,
      handler: this.uploadImages,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new UploadFileMiddleware(this.config.get('UPLOAD_DIRECTORY'), 'images', true),
      ]
    });
  }

  public async create(
    {body, user}: Request<Record<string, unknown>, Record<string, unknown>, CreateOfferDto>,
    res: Response,
  ): Promise<void> {

    const offer = await this.offerService.create({...body, hostId: user.id});
    offer?.setIsFavorite(user.id);
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

  public async uploadPreviewImage(
    req: Request<core.ParamsDictionary | UploadPreviewImageParams>,
    res: Response
  ) {
    const {offerId} = req.params;
    const updateDto = {previewImage: req.file?.filename};
    await this.offerService.updateById(offerId, updateDto);
    this.created(res, fillDTO(UploadPreviewImageResponse, updateDto));
  }

  public async uploadImages(
    req: Request<core.ParamsDictionary | UploadPreviewImageParams>,
    res: Response
  ) {
    const {offerId} = req.params;
    const updateDto = {images: (req.files as Express.Multer.File[])?.map(({filename}) => filename)};
    await this.offerService.updateById(offerId, updateDto);
    this.created(res, fillDTO(UploadImagesResponse, updateDto));
  }
}
