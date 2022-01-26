import path from 'path';

import { vol } from 'memfs';

import { Reader, TEMP_DIRECTORY, merge } from '../lib';

jest.mock('fs');

describe(merge, () => {
  test('should generate sorted file', async () => {
    vol.fromJSON({
      './tmp/sorted-chunk-1.txt': '0\n2\n4',
      './tmp/sorted-chunk-2.txt': '1\n3\n5',
    });

    const chunkReaders = [
      new Reader(path.join(TEMP_DIRECTORY, 'sorted-chunk-1.txt')),
      new Reader(path.join(TEMP_DIRECTORY, 'sorted-chunk-2.txt')),
    ];
    await merge(chunkReaders);

    expect(
      vol.readFileSync(path.join(TEMP_DIRECTORY, 'sorted.txt'), {
        encoding: 'utf8',
      })
    ).toEqual('0\n1\n2\n3\n4\n5\n');
  });
});
