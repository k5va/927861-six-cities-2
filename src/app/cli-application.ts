import { CliCommandInterface } from '../cli-command/cli-command.interface.js';
import { CommandNames } from '../cli-command/command-names.enum.js';

type ParsedCommand = {
  [key: string]: string[]
}

export default class CLIApplication {
  private static readonly COMMAND_PREFIX = '--';
  private static readonly DEFAULT_COMMAND = CommandNames.help;

  private commands: {[propertyName: string]: CliCommandInterface} = {};

  private parseCommands(cliArguments: string[]): ParsedCommand {
    const parsedCommand: ParsedCommand = {};
    let command: string | null = null;

    return cliArguments.reduce((acc, item) => {
      if (item.startsWith(CLIApplication.COMMAND_PREFIX)) {
        command = item;
        acc[command] = [];
      } else if (command && item) {
        acc[command].push(item);
      }

      return acc;
    }, parsedCommand);
  }

  private getCommand(commandName: string): CliCommandInterface {
    return this.commands[commandName] ?? this.commands[CLIApplication.DEFAULT_COMMAND];
  }

  /**
   * Parses commands from array of CLI arguments and executes them
   * @param {string[]} cliArguments - array of CLI arguments to be processed
   */
  public processCommands(cliArguments: string[]): void {
    const parsedCommands = this.parseCommands(cliArguments);

    if (Object.keys(parsedCommands).length === 0) { // add default if no commands
      parsedCommands[CLIApplication.DEFAULT_COMMAND] = [];
    }

    for (const [name, args] of Object.entries(parsedCommands)) {
      this.getCommand(name).execute(...args);
    }
  }

  /**
   * Registers given list of commands
   * @param {CliCommandInterface[]} commandList - list of commands to be registered
   */
  public registerCommands(commandList: CliCommandInterface[]): void {
    commandList.reduce((acc, command) => {
      acc[command.name] = command;
      return acc;
    }, this.commands);
  }
}
