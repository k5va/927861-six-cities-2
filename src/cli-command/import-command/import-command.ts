import chalk from 'chalk';
import TSVFileReader from '../../common/file-reader/tsv-file-reader.js';
import CliCommandInterface from '../cli-command.interface.js';
import CommandNames from '../command-names.enum.js';

export default class ImportCommand implements CliCommandInterface {
  public readonly name = CommandNames.import;

  /**
   * Executes command
   * @param {string} fileName - file path
   */
  public execute(fileName: string) {
    const fileReader = new TSVFileReader(fileName.trim());
    fileReader.addListener(TSVFileReader.READ_LINE_EVENT, this.readLineHandler);
    fileReader.addListener(TSVFileReader.END_OF_FILE_EVENT, this.fileEndHandler);

    try {
      fileReader.read();
    } catch (err) {

      if (!(err instanceof Error)) {
        throw err;
      }

      console.log(chalk.red(`Не удалось импортировать данные из файла по причине: «${err.message}»`));
    }
  }

  /**
   * Read line handler
   * @param {string} line - line from file
   */
  private readLineHandler = (line: string) => {
    console.log(chalk.blueBright(line));
  };

  /**
   * End of file hander
   */
  private fileEndHandler = () => {
    console.log(chalk.yellow('end of file'));
  };
}
