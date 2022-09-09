import chalk from 'chalk';
import { CliCommandInterface } from './cli-command.interface.js';
import { CommandNames } from './command-names.enum.js';

export default class HelpCommand implements CliCommandInterface {
  public readonly name = CommandNames.help;

  /**
   * Executes command
   */
  public execute() {
    console.log(chalk.green(`
      Программа для подготовки данных для REST API сервера.
      Пример:
          cli.js --<command> [--arguments]
      Команды:
          --version:                        # Выводит информацию о версии приложения
          --help:                           # Печатает этот текст
          --import <filepath>:              # Импортирует в базу данных информацию из tsv-файла
          --generate <n> <filepath> <url>   # Создаёт файл в формате tsv с тестовыми данными
      `
    ));
  }
}
