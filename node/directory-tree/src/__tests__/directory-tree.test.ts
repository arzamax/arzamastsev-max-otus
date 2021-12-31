import { vol } from 'memfs';

import { directoryTree } from '../lib';

jest.mock('fs');

const ROOT = '/root';

describe(directoryTree, () => {
  beforeEach(() => {
    vol.reset();
  });

  test('should return directory tree info', async () => {
    vol.fromJSON(
      {
        './dir1/dir1-file1.js': 'dir1-file1',
        './dir1/dir1-file2.js': 'dir1-file2',
        './dir2/dir2-file1.js': 'dir2-file1',
      },
      ROOT
    );

    const { tree, directoryCount, fileCount } = await directoryTree(ROOT);
    expect(directoryCount).toEqual(2);
    expect(fileCount).toEqual(3);
    expect(tree).toEqual(
      'root\n├─dir1\n|  ├─dir1-file1.js\n|  └─dir1-file2.js\n└─dir2\n  └─dir2-file1.js'
    );
  });

  test('should return directory tree info with default depth', async () => {
    vol.fromJSON(
      {
        './dir1/dir2/dir3/dir4/dir4-file1.js': 'dir4-file1',
      },
      ROOT
    );

    const { tree, directoryCount, fileCount } = await directoryTree(ROOT);
    expect(directoryCount).toEqual(2);
    expect(fileCount).toEqual(0);
    expect(tree).toEqual('root\n└─dir1\n  └─dir2');
  });

  test('should return directory tree info with custom depth', async () => {
    vol.fromJSON(
      {
        './dir1/dir2/dir3/dir4/dir5/dir5-file1.js': 'dir5-file1',
      },
      ROOT
    );

    const { tree, directoryCount, fileCount } = await directoryTree(ROOT, 6);
    expect(directoryCount).toEqual(5);
    expect(fileCount).toEqual(1);
    expect(tree).toEqual(
      'root\n└─dir1\n  └─dir2\n    └─dir3\n      └─dir4\n        └─dir5\n          └─dir5-file1.js'
    );
  });
});
