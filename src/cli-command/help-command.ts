import { CliCommandInterface } from './cli-command.interface.js';

export default class HelpCommand implements CliCommandInterface {
  private static readonly COMMAND_NAME = '--help';

  public readonly name = HelpCommand.COMMAND_NAME;

  public execute() {
    console.log(`
      Программа для подготовки данных для REST API сервера.
      Пример:
          main.js --<command> [--arguments]
      Команды:
          --version:                   # выводит номер версии
          --help:                      # печатает этот текст
          --import <path>:             # импортирует данные из TSV
          --generator <n> <path> <url> # генерирует произвольное количество тестовых данных
      `
    );
  }
}
