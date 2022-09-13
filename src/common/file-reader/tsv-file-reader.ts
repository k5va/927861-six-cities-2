import { createReadStream } from 'fs';
import { FileReaderInterface } from './file-reader.interface.js';

export default class TSVFileReader implements FileReaderInterface {
  public static readonly READ_LINE_EVENT = 'readline';
  public static readonly END_OF_FILE_EVENT = 'end';
  private static readonly READ_SIZE = 16000;
  private static readonly FILE_ENCODING = 'utf-8';
  private static readonly END_OF_LINE = '\n';

  /**
   * Creates new instance of TSVFileReader
   * @param filename - tsv file path
   */
  constructor(public filename: string) {}

  /**
   * Reads raw data from provided file
   * @returns {AsyncGenerator} - async generator that yields line of data from file
   */
  public async * read(): AsyncGenerator<string> {
    const readStream = createReadStream(
      this.filename, {highWaterMark: TSVFileReader.READ_SIZE, encoding: TSVFileReader.FILE_ENCODING}
    );

    let line = '';
    let endOfLine = -1;

    for await (const chunk of readStream) {
      line = line.concat(chunk);
      while ((endOfLine = line.indexOf(TSVFileReader.END_OF_LINE)) !== -1) {
        yield line.substring(0, endOfLine);
        line = line.substring(endOfLine + 1);
      }
    }
  }
}
