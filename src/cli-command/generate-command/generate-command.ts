import got from 'got';
import { MockData } from '../../types';
import CliCommandInterface from '../cli-command.interface.js';
import CommandNames from '../command-names.enum.js';
import OfferGenerator from '../../common/offer-generator/offer-generator.js';
import TSVFileWriter from '../../common/file-writer/tsv-file-writer.js';

export default class GenerateCommand implements CliCommandInterface {
  public readonly name = CommandNames.generate;
  private initialData!: MockData;

  /**
   * Executes command
   */
  public async execute(count: string, filePath: string, url: string): Promise<void> {
    const offerCount = Number(count);

    try {
      this.initialData = await got.get(url).json();
      const offerGenerator = new OfferGenerator(this.initialData, offerCount).generate();
      const fileWriter = new TSVFileWriter(filePath);

      for (const offer of offerGenerator) {
        await fileWriter.write(offer);
      }

      console.log(`File ${filePath} was created!`);
    } catch {
      return console.log(`Can't fetch data from ${url}.`);
    }
  }
}
