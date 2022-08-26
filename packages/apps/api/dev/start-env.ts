import 'reflect-metadata';
import {
  __elasticsearch_uri__,
  __https__,
  __mongodb_uri__,
  __prod__,
  __redis_uri__,
} from '@src/constants';
import chalk from 'chalk';
import ElasticMemoryServer from 'elasticsearch-memory-server';
import ip from 'ip';
import { MongoMemoryReplSet } from 'mongodb-memory-server';
import readline from 'readline';
import { RedisMemoryServer } from 'redis-memory-server';
import { initializeElasticsearch } from './elasticsearch';
import { initializeMongoDB } from './mongodb';
import { initializeRedis } from './redis';
import { reseed } from './reseed';
import { initializeNgrok } from './ngrok';

if (__prod__) {
  throw new Error('DB must only be run in development mode.');
}

readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);

const { log } = console;

let redisProcess: RedisMemoryServer | undefined;
const startRedis = async () => {
  redisProcess = await initializeRedis();
  log(chalk.hex('#247aee').bold('>> Initialized Redis'));
};
let mongoDBProcess: MongoMemoryReplSet | undefined;
const startMongoDB = async () => {
  mongoDBProcess = await initializeMongoDB();
  log(chalk.hex('#247aee').bold('>> Initialized MongoDB'));
};

let elasticProcess: ElasticMemoryServer | undefined;
const startElasticsearch = async () => {
  elasticProcess = await initializeElasticsearch();
  log(chalk.hex('#247aee').bold('>> Initialized Elasticsearch'));
};

let ngrokUrl: string | undefined;

const startNgrok = async () => {
  ngrokUrl = await initializeNgrok();
  log(chalk.hex('#247aee').bold('>> Initialized Ngrok'));
};

export const displayInfo = () => {
  log();
  log(
    chalk.white.bgHex('#247aee').bold('                     '),
    chalk.bgWhite.hex('#247aee').bold(' We Live  ')
  );
  log(
    chalk.white.bgHex('#247aee').bold('  Easy POS API  '),
    chalk.bgWhite.hex('#247aee').bold(' to       ')
  );
  log(
    chalk.white.bgHex('#247aee').bold('                     '),
    chalk.bgWhite.hex('#247aee').bold(' Explore  ')
  );
  log();
  log(
    chalk.bold('API:'),
    chalk(
      __https__
        ? `https://${ip.address()}:${5000}`
        : `http://${ip.address()}:${5000}`
    )
  );
  log(chalk.bold('Redis URI:'), chalk(__redis_uri__));
  log(chalk.bold('MongoDB URI:'), chalk(__mongodb_uri__));
  log(chalk.bold('Elasticsearch URI:'), chalk(__elasticsearch_uri__));
  log(chalk.bold('Ngrok URI:'), chalk(ngrokUrl));
  log(chalk.hex('#247aee').bold("Press 'R' to reseed"));
  log(chalk.hex('#247aee').bold("Press 'h' to display server information"));
};

const killDbs = async () => {
  if (redisProcess?.stop) {
    await redisProcess.stop();
  }
  if (mongoDBProcess?.stop) {
    await mongoDBProcess.stop();
  }
  if (elasticProcess?.stop) {
    await elasticProcess.stop();
  }
};

const main = async () => {
  try {
    let reseeding = false;
    process.stdin.on('keypress', async (_key, data) => {
      if (!reseeding) {
        if (data.ctrl && data.name === 'c') {
          process.stdout.write(chalk.white.bold('Exiting...'));
          await killDbs();
          process.exit();
        } else if (data.sequence === 'R') {
          log();
          reseeding = true;
          process.stdout.write(chalk.yellow.bold('Reseeding'));
          const loading = setInterval(() => {
            process.stdout.write(chalk.yellow.bold('.'));
          }, 700);
          await reseed();
          clearInterval(loading);
          readline.cursorTo(process.stdout, 0, undefined);
          process.stdout.write(chalk.green.bold('Reseeding Complete'));
          reseeding = false;
          log();
        } else if (data.sequence === 'h') {
          displayInfo();
        }
      }
    });

    log(chalk.hex('#247aee').bold('>> Initializing environment...'));
    await startNgrok();
    await startRedis();
    await startMongoDB();
    await startElasticsearch();
    displayInfo();
  } catch (err) {
    console.error(err);
    await killDbs();
    process.exit();
  }
};
main();
