import { merge, splitFile } from './lib';

(async () => {
  const chunkReaders = await splitFile(1_000_000);
  await merge(chunkReaders);
})();
