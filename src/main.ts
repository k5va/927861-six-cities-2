import Application from './app/application.js';
import { appContainer } from './common/container/container.js';
import { Component } from './types/index.js';

const app = appContainer.get<Application>(Component.Application);
app.init();
