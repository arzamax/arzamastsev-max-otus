import fs from 'fs';

import { Parser, parse } from 'csv-parse';

export class Reader {
  private stream: Parser;

  constructor(filePath: string) {
    this.stream = fs
      .createReadStream(filePath)
      .pipe(parse({ delimiter: '\n', onRecord: ([str]) => Number(str) }));
  }

  public read() {
    return new Promise<number | null>(resolve => {
      if (this.stream.readableEnded) {
        resolve(null);
      } else {
        this.stream.once('readable', () => {
          resolve(this.stream.read());
        });
      }
    });
  }
}
