import 'reflect-metadata';
import { Container } from 'inversify';
import Application from '../../app/application.js';
import { Component } from '../../types/index.js';
import { ConfigInterface } from '../config/config.interface.js';
import ConfigService from '../config/config.service.js';
import LoggerService from '../logger/logger-service.js';
import { LoggerInterface } from '../logger/logger.interface.js';
import { DatabaseInterface } from '../database-client/database.interface.js';
import DatabaseService from '../database-client/database.service.js';
import { UserServiceInterface } from '../../modules/user/user-service.interface.js';
import UserService from '../../modules/user/user.service.js';
import { types } from '@typegoose/typegoose';
import { UserEntity, UserModel } from '../../modules/user/user.entity.js';
import { GoodEntity, GoodModel } from '../../modules/good/good.entity.js';

const appContainer = new Container();

appContainer.bind<Application>(Component.Application).to(Application).inSingletonScope();
appContainer.bind<LoggerInterface>(Component.LoggerInterface).to(LoggerService).inSingletonScope();
appContainer.bind<ConfigInterface>(Component.ConfigInterface).to(ConfigService).inSingletonScope();
appContainer.bind<DatabaseInterface>(Component.DatabaseInterface).to(DatabaseService).inSingletonScope();
appContainer.bind<UserServiceInterface>(Component.DatabaseInterface).to(UserService).inSingletonScope();
appContainer.bind<types.ModelType<UserEntity>>(Component.UserModel).toConstantValue(UserModel);
appContainer.bind<types.ModelType<GoodEntity>>(Component.UserModel).toConstantValue(GoodModel);

export { appContainer };
