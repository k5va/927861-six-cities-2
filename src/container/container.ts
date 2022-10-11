import 'reflect-metadata';
import { Container } from 'inversify';
import Application from '../app/application.js';
import { Component } from '../types/index.js';
import { ConfigInterface, ConfigService, LoggerService,
  LoggerInterface, DatabaseInterface, DatabaseService, ControllerInterface,
  ExceptionFilterInterface, ExceptionFilter } from '../common/index.js';
import { UserServiceInterface, CityServiceInterface, GoodServiceInterface,
  OfferServiceInterface, UserService, CityService, OfferService, GoodService,
  UserEntity, UserModel, GoodEntity, GoodModel, CityEntity, CityModel,
  OfferEntity, OfferModel, CommentServiceInterface, CommentService,
  CommentEntity, CommentModel, UserController, OfferController, FavoritesController,
  PremiumsController, CommentController } from '../modules/index.js';
import { types } from '@typegoose/typegoose';
import { ImportCommand } from '../cli-command/index.js';

const appContainer = new Container();

appContainer.bind<Application>(Component.Application).to(Application).inSingletonScope();
appContainer.bind<LoggerInterface>(Component.LoggerInterface).to(LoggerService).inSingletonScope();
appContainer.bind<ConfigInterface>(Component.ConfigInterface).to(ConfigService).inSingletonScope();
appContainer.bind<DatabaseInterface>(Component.DatabaseInterface).to(DatabaseService).inSingletonScope();
appContainer.bind<UserServiceInterface>(Component.UserServiceInterface).to(UserService).inSingletonScope();
appContainer.bind<CityServiceInterface>(Component.CityServiceInterface).to(CityService).inSingletonScope();
appContainer.bind<GoodServiceInterface>(Component.GoodServiceInterface).to(GoodService).inSingletonScope();
appContainer.bind<OfferServiceInterface>(Component.OfferServiceInterface).to(OfferService).inSingletonScope();
appContainer.bind<CommentServiceInterface>(Component.CommentServiceInterface).to(CommentService).inSingletonScope();
appContainer.bind<types.ModelType<UserEntity>>(Component.UserModel).toConstantValue(UserModel);
appContainer.bind<types.ModelType<GoodEntity>>(Component.GoodModel).toConstantValue(GoodModel);
appContainer.bind<types.ModelType<CityEntity>>(Component.CityModel).toConstantValue(CityModel);
appContainer.bind<types.ModelType<OfferEntity>>(Component.OfferModel).toConstantValue(OfferModel);
appContainer.bind<types.ModelType<CommentEntity>>(Component.CommentModel).toConstantValue(CommentModel);
appContainer.bind<ImportCommand>(Component.ImportCommand).to(ImportCommand);
appContainer.bind<ExceptionFilterInterface>(Component.ExceptionFilter).to(ExceptionFilter).inSingletonScope();
appContainer.bind<ControllerInterface>(Component.UserController).to(UserController).inSingletonScope();
appContainer.bind<ControllerInterface>(Component.OfferController).to(OfferController).inSingletonScope();
appContainer.bind<ControllerInterface>(Component.FavoritesController).to(FavoritesController).inSingletonScope();
appContainer.bind<ControllerInterface>(Component.PremiumsController).to(PremiumsController).inSingletonScope();
appContainer.bind<ControllerInterface>(Component.CommentController).to(CommentController).inSingletonScope();

export { appContainer };
