import { ErrorType } from './error.types';

export class BaseError extends Error {
  type: ErrorType;
  statusCode: number;

  constructor(
    message: string,
    statusCode = 500,
    type = ErrorType.InternalServerError
  ) {
    super(message);
    this.message = message;
    this.statusCode = statusCode;
    this.type = type;
  }
}

export class InvalidSessionError extends BaseError {
  constructor(message: string) {
    super(message, 401, ErrorType.InvalidSession);
  }
}

export class UnauthorizedError extends BaseError {
  constructor(message?: string) {
    super(message || 'Unauthorized', 401, ErrorType.Unauthorized);
  }
}
