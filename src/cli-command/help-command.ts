import { CliCommandInterface } from './cli-command.interface.js';

export default class HelpCommand implements CliCommandInterface {
  private static readonly COMMAND_NAME = '--help';

  public readonly name = HelpCommand.COMMAND_NAME;

  public execute() {
    console.log(`
      Программа для подготовки данных для REST API сервера.
      Пример:
          cli.js --<command> [--arguments]
      Команды:
          --version:                        # Выводит информацию о версии приложения
          --help:                           # Печатает этот текст
          --import <filepath>:              # Импортирует в базу данных информацию из tsv-файла
          --generate <n> <filepath> <url>   # Создаёт файл в формате tsv с тестовыми данными
      `
    );
  }
}
