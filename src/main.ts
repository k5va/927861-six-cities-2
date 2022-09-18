import Application from './app/application.js';
import LoggerService from './common/logger/logger-service.js';

const logger = new LoggerService();
const app = new Application(logger);
app.init();
