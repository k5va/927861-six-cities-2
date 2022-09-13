import chalk from 'chalk';
import { readFileSync } from 'fs';
import CliCommandInterface from '../cli-command.interface.js';
import CommandNames from '../command-names.enum.js';

export default class VersionCommand implements CliCommandInterface {
  public readonly name = CommandNames.version;

  private readVersion(): string {
    const contentPageJSON = readFileSync('./package.json', 'utf-8');
    const content = JSON.parse(contentPageJSON);
    return content.version;
  }

  /**
   * Executes command
   */
  public async execute(): Promise<void> {
    const version = this.readVersion();
    console.log(chalk.red(version));
  }
}
