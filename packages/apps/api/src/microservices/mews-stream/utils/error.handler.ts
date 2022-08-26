import { ErrorRequestHandler } from 'express';
import { BaseError } from './errors';

export const errorHandler: ErrorRequestHandler = (
  err: BaseError,
  _req,
  res,
  _next
) => {
  // TODO: Add Winston logging

  if (err.name === 'UnauthorizedError') {
    return res.sendStatus(401);
  }

  return res.status(err.statusCode || 500).send({ message: err.message });
};
