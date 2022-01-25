import { ExecException, exec } from 'child_process';
import path from 'path';

import { scripts } from '../../package.json';

describe('cli', () => {
  describe('directory tree info', () => {
    let error: ExecException | null = null;

    beforeAll(done => {
      exec(`${scripts.start} --path=${__dirname}`, err => {
        error = err;
        done();
      });
    });

    test('should display directory tree info with no errors', () => {
      expect(error).toBeNull();
    });
  });

  describe('invalid path error', () => {
    let stdout: string;

    beforeAll(done => {
      exec(
        `${scripts.start} --path=${path.join(__dirname, 'dir')}`,
        (_, result) => {
          stdout = result;
          done();
        }
      );
    });

    test('should handle invalid path error', () => {
      expect(stdout.trim()).toEqual('Invalid path');
    });
  });
});
