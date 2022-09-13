import chalk from 'chalk';
import TSVFileReader from '../../common/file-reader/tsv-file-reader.js';
import CliCommandInterface from '../cli-command.interface.js';
import CommandNames from '../command-names.enum.js';
import { createOffer } from './create-offer.js';

export default class ImportCommand implements CliCommandInterface {
  public readonly name = CommandNames.import;

  /**
   * Executes command
   * @param {string} fileName - file path
   */
  public async execute(fileName: string): Promise<void> {
    const fileReader = new TSVFileReader(fileName.trim());

    try {
      for await (const line of fileReader.read()) {
        console.log(createOffer(line));
      }
    } catch (err) {

      if (!(err instanceof Error)) {
        throw err;
      }

      console.log(chalk.red(`Не удалось импортировать данные из файла по причине: «${err.message}»`));
    }
  }
}
