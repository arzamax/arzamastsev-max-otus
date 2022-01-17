import fs from 'fs';
import path from 'path';

import ProgressBar from 'progress';

const TEMP_DIRECTORY = 'tmp';
const FILE_SIZE = 1024 * 1024 * 100;

export const getRandomInteger = (min: number, max: number) =>
  Math.floor(min + Math.random() * (max + 1 - min));

(() => {
  fs.rmSync(TEMP_DIRECTORY, { recursive: true, force: true });
  fs.mkdirSync(TEMP_DIRECTORY);
  const writeStream = fs.createWriteStream(
    path.resolve(process.cwd(), TEMP_DIRECTORY, 'unsorted.txt')
  );
  const progressBar = new ProgressBar(
    'Generating unsorted file [:bar] :percent',
    {
      total: FILE_SIZE,
      incomplete: ' ',
    }
  );
  let bytes = 0;

  while (bytes < FILE_SIZE) {
    const str = `${getRandomInteger(-1_000_000, 1_000_000)}\n`;
    const strBytes = Buffer.byteLength(str);

    progressBar.tick(strBytes);
    bytes += Buffer.byteLength(str);
    writeStream.write(str);
  }

  writeStream.end();
})();
