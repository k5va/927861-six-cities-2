#!/usr/bin/env node

import CLIApplication from './app/cli-application.js';
import GenerateCommand from './cli-command/generate-command/generate-command.js';
import { HelpCommand, ImportCommand, VersionCommand } from './cli-command/index.js';

const cli = new CLIApplication();
cli.registerCommands([
  new HelpCommand(), new VersionCommand(), new ImportCommand(), new GenerateCommand()
]);
cli.processCommands(process.argv);
