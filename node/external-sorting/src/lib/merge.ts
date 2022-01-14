import fs from 'fs';
import path from 'path';

import { Reader } from './reader';
import { Queue } from './queue';
import { TEMP_DIRECTORY } from './constants';

export const merge = (chunkReaders: Reader[]) =>
  new Promise<void>(async resolve => {
    const queue = new Queue();
    const writeStream = fs.createWriteStream(
      path.join(TEMP_DIRECTORY, 'sorted.txt')
    );

    for (let i = 0; i < chunkReaders.length; i++) {
      const reader = chunkReaders[i];
      const value = await reader.read();

      if (value !== null) queue.add({ value, readerIndex: i });
    }

    while (!queue.isEmpty) {
      const { value, readerIndex } = queue.pop()!;
      const reader = chunkReaders[readerIndex];
      const nextValue = await reader.read();

      writeStream.write(`${value}\n`);
      if (nextValue !== null) queue.add({ value: nextValue, readerIndex });
    }

    writeStream.end(() => {
      resolve();
    });
  });
