import fs from 'fs';
import path from 'path';
import util from 'util';

type StackItem = {
  prevPath: string;
  prevDepth: number;
  prevStr: string;
  isLast: boolean;
};

const DEFAULT_DEPTH = 2;

const readdir = util.promisify(fs.readdir);
const stat = util.promisify(fs.stat);

export const directoryTree = async (root: string, depth = DEFAULT_DEPTH) => {
  const rootDirectory = path.resolve(root);
  const rootItems = await readdir(rootDirectory);

  const stack: StackItem[] = [];

  let tree = path.basename(rootDirectory);
  let directoryCount = 0;
  let fileCount = 0;

  for (let i = 0; i < rootItems.length; i++) {
    stack.unshift({
      prevPath: path.join(rootDirectory, rootItems[i]),
      prevDepth: 0,
      prevStr: '',
      isLast: i === rootItems.length - 1,
    });
  }

  while (stack.length) {
    const { prevPath, prevDepth, prevStr, isLast } = stack.pop()!;
    const name = path.basename(prevPath);

    tree = `${tree}\n${prevStr}${isLast ? '└' : '├'}─${name}`;

    if ((await stat(prevPath)).isDirectory()) {
      const items = await readdir(prevPath);
      const nextDepth = prevDepth + 1;

      directoryCount++;

      if (nextDepth < depth) {
        for (let j = items.length - 1; j >= 0; j--) {
          stack.push({
            prevPath: path.join(prevPath, items[j]),
            prevDepth: nextDepth,
            prevStr: `${prevStr}${isLast ? ' ' : '| '} `,
            isLast: j === items.length - 1,
          });
        }
      }
    } else fileCount++;
  }

  return {
    tree,
    directoryCount,
    fileCount,
  };
};
