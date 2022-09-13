import { once } from 'events';
import { createWriteStream } from 'fs';
import { FileWriterInterface } from './file-writer.interface.js';

export default class TSVFileWriter implements FileWriterInterface {
  public static readonly READ_LINE_EVENT = 'readline';
  public static readonly END_OF_FILE_EVENT = 'end';
  private static readonly READ_SIZE = 16000;
  private static readonly FILE_ENCODING = 'utf-8';
  private static readonly END_OF_LINE = '\n';

  private readonly writeStream;

  /**
   * Creates new instance of TSVFileWriter
   * @param filename - tsv file path
   */
  constructor(public filename: string) {
    this.writeStream = createWriteStream(
      this.filename, {
        flags: 'w',
        highWaterMark: TSVFileWriter.READ_SIZE,
        encoding: TSVFileWriter.FILE_ENCODING,
        autoClose: true,
      }
    );
  }

  /**
   * Writes line of data to file
   * @returns {Promise<void>}
   * */
  public async write(line: string): Promise<void> {
    if (!this.writeStream.write(`${line}${TSVFileWriter.END_OF_LINE}`)) {
      await once(this.writeStream, 'drain');
    }
  }
}
