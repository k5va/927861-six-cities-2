import { readFileSync } from 'fs';
import { CliCommandInterface } from './cli-command.interface.js';

export default class VersionCommand implements CliCommandInterface {
  private static readonly COMMAND_NAME = '--version';

  public readonly name = VersionCommand.COMMAND_NAME;

  private readVersion(): string {
    const contentPageJSON = readFileSync('./package.json', 'utf-8');
    const content = JSON.parse(contentPageJSON);
    return content.version;
  }

  public execute() {
    const version = this.readVersion();
    console.log(version);
}
}