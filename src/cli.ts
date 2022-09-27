#!/usr/bin/env node

import 'reflect-metadata';
import CLIApplication from './app/cli-application.js';
import GenerateCommand from './cli-command/generate-command/generate-command.js';
import { HelpCommand, VersionCommand } from './cli-command/index.js';
import { appContainer } from './container/container.js';
import { Component } from './types/index.js';

const cli = new CLIApplication();
cli.registerCommands([
  new HelpCommand(),
  new VersionCommand(),
  appContainer.get(Component.ImportCommand),
  new GenerateCommand()
]);
cli.processCommands(process.argv);
