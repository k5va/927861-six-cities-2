import * as core from 'express-serve-static-core';
import { Controller, LoggerInterface,
  ValidateObjectIdMiddleware, ValidateDtoMiddleware,
  DocumentExistsMiddleware, PrivateRouteMiddleware, ConfigInterface} from '../../common/index.js';
import { inject, injectable } from 'inversify';
import { Component, HttpMethod } from '../../types/index.js';
import { Request, Response } from 'express';
import CreateCommentDto from './dto/create-comment.dto.js';
import CommentResponse from './response/comment.response.js';
import { CommentServiceInterface } from './comment-service.interface.js';
import { StatusCodes } from 'http-status-codes';
import { fillDTO } from '../../utils/index.js';
import { OfferServiceInterface } from '../offer/offer-service.interface.js';
import { CreateParams, IndexParams } from './comment.types.js';

@injectable()
export default class CommentController extends Controller {
  constructor(
    @inject(Component.LoggerInterface) logger: LoggerInterface,
    @inject(Component.ConfigInterface) config: ConfigInterface,
    @inject(Component.CommentServiceInterface) private readonly commentService: CommentServiceInterface,
    @inject(Component.OfferServiceInterface) private readonly offerService: OfferServiceInterface,
  ) {
    super(logger, config);

    this.logger.info('Registering routes for CommentControllerâ€¦');
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Get,
      handler: this.index,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
      ]
    });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateDtoMiddleware(CreateCommentDto),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
      ]
    });
  }

  public async create(
    {params, body, user}: Request<core.ParamsDictionary | CreateParams,
    Record<string, unknown>, CreateCommentDto>,
    res: Response,
  ): Promise<void> {

    const comment = await this.offerService.addComment(params.offerId, {...body, userId: user.id});
    this.send(res, StatusCodes.CREATED, fillDTO(CommentResponse, comment));
  }

  public async index(
    {params}: Request<core.ParamsDictionary | IndexParams>,
    res: Response,
  ): Promise<void> {

    const comments = await this.commentService.findByOfferId(params.offerId);
    this.ok(res, fillDTO(CommentResponse, comments));
  }
}
