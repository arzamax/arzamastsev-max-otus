#!/usr/bin/env node

import { Command } from 'commander';

import { directoryTree } from '../lib';

(async () => {
  const program = new Command();

  program
    .option('-p, --path <string>', 'Root directory path')
    .option('-d, --depth <number>', 'Max directory tree depth')
    .helpOption('-h, --help', 'Output usage information');

  program.parse(process.argv);

  const { path, depth } = program.opts();

  if (!path) {
    program.outputHelp();
  } else {
    try {
      const { tree, directoryCount, fileCount } = await directoryTree(
        path,
        depth
      );
      console.log(
        `${tree}\nDirectories: ${directoryCount}\nFiles: ${fileCount}`
      );
    } catch {
      console.log('Invalid path');
    }
  }
})();
