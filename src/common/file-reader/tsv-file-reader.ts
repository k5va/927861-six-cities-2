import EventEmitter from 'events';
import { createReadStream } from 'fs';
import { FileReaderInterface } from './file-reader.interface.js';

export default class TSVFileReader extends EventEmitter implements FileReaderInterface {
  public static readonly READ_LINE_EVENT = 'readline';
  public static readonly END_OF_FILE_EVENT = 'end';
  private static readonly READ_SIZE = 16000;
  private static readonly FILE_ENCODING = 'utf-8';
  private static readonly END_OF_LINE = '\n';

  /**
   * Creates new instance of TSVFileReader
   * @param filename - tsv file path
   */
  constructor(public filename: string) {
    super();
  }

  /**
   * Reades raw data from provided file
   */
  public read(): void {
    const readStream = createReadStream(
      this.filename, {highWaterMark: TSVFileReader.READ_SIZE, encoding: TSVFileReader.FILE_ENCODING}
    );
    let line = '';

    readStream
      .on('readable', () => {
        let endOfLine = -1;
        let chunk = '';
        while ((chunk = readStream.read(TSVFileReader.READ_SIZE)) !== null) {
          line = line.concat(chunk);
          while ((endOfLine = line.indexOf(TSVFileReader.END_OF_LINE)) !== -1) {
            this.emit(TSVFileReader.READ_LINE_EVENT, line.substring(0, endOfLine));
            line = line.substring(endOfLine + 1);
          }
        }
      })
      .once('end', () => this.emit(TSVFileReader.END_OF_FILE_EVENT));
  }
}
