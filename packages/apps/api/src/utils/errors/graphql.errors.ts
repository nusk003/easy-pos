import { ApolloError } from 'apollo-server-errors';
import { AuthenticationError as ApolloAuthenticationError } from 'apollo-server-fastify';
import { ClassConstructor } from 'class-transformer';

export enum ErrorCodes {
  BadRequest = 'bad_request',
  Conflict = 'conflict',
  NotFound = 'not_found',
  Internal = 'internal_error',
  InvalidSession = 'invalid_session',
  Unauthenticated = 'UNAUTHENTICATED',
}

export class AuthenticationError extends ApolloAuthenticationError {
  constructor() {
    super('Unauthorized');
  }
}

export class BadRequestError extends ApolloError {
  constructor(message: string) {
    super(message, ErrorCodes.BadRequest);
  }
}

export class MissingHeaderError extends BadRequestError {
  constructor(header: 'hotel-id') {
    super(
      `The requested operation falied as header \`${header}\` was not set.`
    );
  }
}

export class ConflictError extends ApolloError {
  constructor(entity: ClassConstructor<any>, fields: Record<string, string>) {
    const [[field, value]] = Object.entries(fields);
    super(
      `The requested operation falied as \`${entity.name.toLowerCase()}\` had existing parameter on field \`${field}\` for value \`${value}\`.`,
      ErrorCodes.Conflict
    );
  }
}

export class NotFoundError extends ApolloError {
  constructor(
    entity: ClassConstructor<any>,
    fields: Record<string, string | undefined>
  ) {
    const [[field, value]] = Object.entries(fields);
    super(
      `The requested operation falied as \`${entity.name.toLowerCase()}\` had no matching parameter on field \`${field}\` for value \`${value}\`.`,
      ErrorCodes.NotFound
    );
  }
}

export class UnauthorizedResourceError extends ApolloError {
  constructor(user: ClassConstructor<any>, id: string) {
    super(
      `The requested operation falied as \`${user.name.toLowerCase()}\` with id \`${id}\` does not have permissions to access the requested resource.`,
      ErrorCodes.NotFound
    );
  }
}

export class InvalidSessionError extends ApolloError {
  constructor(field: 'hotel' | 'guest' | 'user') {
    super(
      `The requested operation falied as session had no valid ${field} properties.`,
      ErrorCodes.InvalidSession
    );
  }
}

export class InternalError extends ApolloError {
  constructor(error: any) {
    console.error(error);
    super('Internal Error. Please try again later.', ErrorCodes.Internal);
  }
}
