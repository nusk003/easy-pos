import {
  registerDecorator,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationError,
} from 'class-validator';
import * as cv from 'class-validator';

@ValidatorConstraint({ name: 'isCollection', async: true })
export class IsCollectionValidator implements ValidatorConstraintInterface {
  errors: ValidationError[];

  public async validate(collection: any, _args: ValidationArguments) {
    for (const doc of collection) {
      const errors = await cv.validate(doc);
      if (errors.length) {
        this.errors = errors;
        return false;
      }
    }
    return true;
  }

  public defaultMessage(args: ValidationArguments) {
    const [relatedPropertyName] = args.constraints;
    const nestedError = Object.values(this.errors[0].constraints || {})[0];
    return `$property must be a ${
      relatedPropertyName().name
    } collection object. Nested error: ${nestedError}`;
  }
}

export function IsCollection(type: () => void) {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isCollection',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [type],
      validator: IsCollectionValidator,
    });
  };
}
