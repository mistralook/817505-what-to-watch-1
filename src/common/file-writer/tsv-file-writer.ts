import { createWriteStream, WriteStream } from 'fs';
import { FileWriterInterface } from './file-writer.interface.js';

export default class TSVFileWriter implements FileWriterInterface {
  private stream: WriteStream;

  constructor(public readonly filename: string) {
    const KB64 = 2 ** 16;
    this.stream = createWriteStream(this.filename, {
      flags: 'w',
      encoding: 'utf8',
      highWaterMark: KB64,
      autoClose: true,
    });
  }

  public async write(row: string): Promise<void> {
    if (!this.stream.write(`${row}\n`)) {
      return new Promise((resolve) => {
        this.stream.once('drain', () => resolve());
      });
    }
    return Promise.resolve();
  }
}