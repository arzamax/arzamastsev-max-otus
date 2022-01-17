import path from 'path';

import { vol } from 'memfs';

import { TEMP_DIRECTORY, splitFile } from '../lib';

jest.mock('fs');

describe(splitFile, () => {
  test('should split unsorted file', async () => {
    vol.fromJSON({
      './tmp/unsorted.txt': '7\n6\n9\n8\n1\n2\n3\n5\n4\n0',
    });

    await splitFile(3);

    expect(vol.toJSON()).toEqual({
      [path.join(TEMP_DIRECTORY, 'unsorted.txt')]:
        '7\n6\n9\n8\n1\n2\n3\n5\n4\n0',
      [path.join(TEMP_DIRECTORY, 'sorted-chunk-1.txt')]: '6\n7\n9',
      [path.join(TEMP_DIRECTORY, 'sorted-chunk-2.txt')]: '1\n2\n8',
      [path.join(TEMP_DIRECTORY, 'sorted-chunk-3.txt')]: '3\n4\n5',
      [path.join(TEMP_DIRECTORY, 'sorted-chunk-4.txt')]: '0',
    });
  });
});
