import { ValidationResolver } from 'react-hook-form';
import * as z from 'zod';

interface ErrorObject {
  values: Record<string, never>;
  errors: Record<string, { message: string }>;
}

export const validationResolver: ValidationResolver<any, any> = (
  data: Record<string, unknown>,
  validationContext: z.ZodObject<any>
) => {
  const zodResult = validationContext.safeParse(data);

  if (zodResult.success) {
    return { values: zodResult.data, errors: {} };
  }

  const errorObject: ErrorObject = {
    values: {},
    errors: {},
  };

  zodResult.error.errors.forEach(
    (error: { path: Array<string | number>; message: string }) => {
      const { message } = error;

      let path = '';

      error.path.forEach((el, idx) => {
        if (typeof el === 'string') {
          if (idx > 0) {
            path += `.${el}`;
          } else {
            path += el;
          }
        } else if (typeof el === 'number') {
          path += `[${el}]`;
        }
      });

      errorObject.errors[path] = { message };
    }
  );

  console.log({ errorObject });

  return errorObject;
};
