import { reseed } from '@dev/reseed';

const main = async () => {
  await reseed();
  process.exit();
};

main();
