import { Controller, LoggerInterface, HttpError } from '../../common/index.js';
import { inject, injectable } from 'inversify';
import { Component, HttpMethod } from '../../types/index.js';
import { Request, Response } from 'express';
import CreateCommentDto from './dto/create-comment.dto.js';
import CommentResponse from './response/comment.response.js';
import { CommentServiceInterface } from './comment-service.interface.js';
import { StatusCodes } from 'http-status-codes';
import { fillDTO } from '../../utils/index.js';

@injectable()
export default class CommentController extends Controller {
  constructor(
    @inject(Component.LoggerInterface) logger: LoggerInterface,
    @inject(Component.CommentServiceInterface) private readonly commentService: CommentServiceInterface,
  ) {
    super(logger);

    this.logger.info('Registering routes for CommentController…');
    this.addRoute({ path: '/:offerId', method: HttpMethod.Get, handler: this.index });
    this.addRoute({ path: '/:offerId', method: HttpMethod.Post, handler: this.create });
  }

  public async create(
    {body, params}: Request<Record<string, string>, Record<string, unknown>, CreateCommentDto>,
    res: Response,
  ): Promise<void> {

    const comment = await this.commentService.create(body); // TODO: Need params???
    if (!comment) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with id «${params.offerId}» doesn't exist.`,
        'CommentController'
      );
    }

    this.send(res, StatusCodes.CREATED, fillDTO(CommentResponse, comment));
  }

  public async index(
    {params}: Request<Record<string, string>, Record<string, unknown>,
    Record<string, unknown>>,
    res: Response,
  ): Promise<void> {

    const comments = await this.commentService.findByOfferId(params.offerId);
    this.ok(res, fillDTO(CommentResponse, comments));
  }
}
