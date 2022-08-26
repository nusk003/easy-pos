import { ClassConstructor } from 'class-transformer';

export class LambdaAuthenticationError extends Error {
  constructor() {
    super('Unauthorized');
  }
}

export class LambdaBadRequestError extends Error {
  constructor(errors: any) {
    super(errors);
  }
}

export class LambdaNotFoundError extends Error {
  constructor(
    entity: ClassConstructor<any>,
    fields: Record<string, string | undefined>
  ) {
    const [[field, value]] = Object.entries(fields);
    super(
      `The requested operation falied as \`${entity.name.toLowerCase()}\` had no matching parameter on field \`${field}\` for value \`${value}\`.`
    );
  }
}

export class LambdaInternalError extends Error {
  constructor(message: string) {
    console.error(message);
    super('Internal Error');
  }
}

export class LambdaMissingHeaderError extends Error {
  constructor(header: 'hotel-id') {
    super(
      `The requested operation falied as header \`${header}\` was not set.`
    );
  }
}
