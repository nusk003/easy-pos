import random from 'random';
import seedrandom from 'seedrandom';

const rand = random.clone(seedrandom('hm'));
rand.patch();

export { rand };
