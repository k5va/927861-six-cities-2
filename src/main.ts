import 'reflect-metadata';
import { Container } from 'inversify';
import Application from './app/application.js';
import LoggerService from './common/logger/logger-service.js';
import { LoggerInterface } from './common/logger/logger.interface.js';
import { Component } from './types/index.js';
import { ConfigInterface } from './common/config/config.interface.js';
import ConfigService from './common/config/config.service.js';

const appContainer = new Container();
appContainer.bind<Application>(Component.Application).to(Application).inSingletonScope();
appContainer.bind<LoggerInterface>(Component.LoggerInterface).to(LoggerService).inSingletonScope();
appContainer.bind<ConfigInterface>(Component.ConfigInterface).to(ConfigService).inSingletonScope();

const app = appContainer.get<Application>(Component.Application);
app.init();
