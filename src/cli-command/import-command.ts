import chalk from 'chalk';
import TSVFileReader from '../common/file-reader/tsv-file-reader.js';
import { CliCommandInterface } from './cli-command.interface.js';
import { CommandNames } from './command-names.enum.js';

export default class ImportCommand implements CliCommandInterface {
  public readonly name = CommandNames.import;

  /**
   * Executes command
   * @param {string} fileName - file path
   */
  public execute(fileName: string) {
    const fileReader = new TSVFileReader(fileName.trim());

    try {
      fileReader.read();
      console.log(chalk.blueBright('Loaded data:'));
      console.log(fileReader.toArray());
    } catch (err) {

      if (!(err instanceof Error)) {
        throw err;
      }

      console.log(chalk.red(`Не удалось импортировать данные из файла по причине: «${err.message}»`));
    }
  }
}
