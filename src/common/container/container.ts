import 'reflect-metadata';
import { Container } from 'inversify';
import Application from '../../app/application.js';
import { Component } from '../../types/index.js';
import { ConfigInterface } from '../config/config.interface.js';
import ConfigService from '../config/config.service.js';
import LoggerService from '../logger/logger-service.js';
import { LoggerInterface } from '../logger/logger.interface.js';

const appContainer = new Container();

appContainer.bind<Application>(Component.Application).to(Application).inSingletonScope();
appContainer.bind<LoggerInterface>(Component.LoggerInterface).to(LoggerService).inSingletonScope();
appContainer.bind<ConfigInterface>(Component.ConfigInterface).to(ConfigService).inSingletonScope();

export { appContainer };
