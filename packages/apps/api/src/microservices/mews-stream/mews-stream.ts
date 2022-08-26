import { MewsStreamService } from './mews-stream.service';
import { MewsStreamJWTPayload } from './mews-stream.types';
import express from 'express';
import jwt from 'express-jwt';
import { __jwt_secret__ } from '@src/constants';
import { errorHandler } from './utils';

const app = express();

app.use(express.json());

app.get('/', (_req, res) => {
  return res.sendStatus(200);
});

app.get('/_healthcheck', (_req, res) => {
  return res.sendStatus(200);
});

app.use(
  jwt({
    secret: __jwt_secret__,
    algorithms: ['HS256'],
  })
);

app.use(async (req, _res, next) => {
  const payload = <MewsStreamJWTPayload>req.user;
  const mewsStreamService = MewsStreamService.getInstance();
  try {
    await mewsStreamService.validateJWTPayload(payload);
    next();
  } catch (error) {
    next(error);
  }
});

app.post('/add-client', async (_req, res, next) => {
  const mewsStreamService = MewsStreamService.getInstance();
  try {
    await mewsStreamService.addClient();
    return res.sendStatus(200);
  } catch (error) {
    next(error);
  }
});

app.post('/delete-client', async (_req, res, next) => {
  const mewsStreamService = MewsStreamService.getInstance();
  try {
    mewsStreamService.deleteClient();
    return res.sendStatus(200);
  } catch (error) {
    next(error);
  }
});

app.use(errorHandler);

export { app as mewsStream };
