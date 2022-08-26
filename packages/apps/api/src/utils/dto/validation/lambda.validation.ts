import { LambdaBadRequestError } from '@src/utils/errors';
import { ClassConstructor, plainToClass } from 'class-transformer';
import { validateOrReject } from 'class-validator';

export const lambdaValidate = async <E>(
  entity: ClassConstructor<E>,
  data: unknown
) => {
  try {
    if (!data) {
      throw new LambdaBadRequestError(
        'Unable to process request as no data was provided.'
      );
    }

    await validateOrReject(plainToClass(<ClassConstructor<any>>entity, data));
    return <E>data;
  } catch (errors) {
    throw new LambdaBadRequestError(errors);
  }
};
