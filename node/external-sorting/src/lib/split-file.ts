import fs from 'fs';
import path from 'path';

import { Reader } from './reader';
import { TEMP_DIRECTORY } from './constants';

export const splitFile = async (chunkSize: number) => {
  const chunkReaders: Reader[] = [];
  const reader = new Reader(path.join(TEMP_DIRECTORY, 'unsorted.txt'));

  while (true) {
    const data = await getChunkData(reader, chunkSize);

    if (!data.length) break;

    chunkReaders.push(await generateChunk(data, chunkReaders.length + 1));
  }

  return chunkReaders;
};

const getChunkData = async (reader: Reader, chunkSize: number) => {
  const data: number[] = [];

  while (data.length < chunkSize) {
    const value = await reader.read();

    if (value === null) break;

    data.push(value);
  }

  return data;
};

const generateChunk = (data: number[], index: number) =>
  new Promise<Reader>(resolve => {
    const filePath = path.join(TEMP_DIRECTORY, `sorted-chunk-${index}.txt`);
    const writeStream = fs.createWriteStream(filePath);

    data.sort((a, b) => a - b);
    writeStream.write(data.join('\n'));
    writeStream.end(() => {
      resolve(new Reader(filePath));
    });
  });
