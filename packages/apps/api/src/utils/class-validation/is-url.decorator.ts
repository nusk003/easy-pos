import {
  registerDecorator,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

export const validateUrl = (value: string) => {
  return /^(?:(?:(?:https?):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:[\.\:](?:[a-z\u00a1-\uffff0-9]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(
    value as string
  );
};

@ValidatorConstraint({ name: 'isURL', async: false })
export class IsURLValidator implements ValidatorConstraintInterface {
  validate(value: string | string[], args: ValidationArguments) {
    const isEach = args.constraints?.[0]?.each;

    if (!Array.isArray(value)) {
      if (isEach) {
        return false;
      }

      return validateUrl(value);
    }

    if (!isEach) {
      return false;
    }

    return !value.some((url) => !validateUrl(url));
  }

  defaultMessage(args: ValidationArguments) {
    const isEach = args.constraints?.[0]?.each;

    if (isEach) {
      return `${args.property} must be an array of valid URLs`;
    }

    return `${args.property} must be a valid URL`;
  }
}

interface IsURLOptions {
  each?: true;
}

export function IsURL(opts?: IsURLOptions) {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isCurrencyCode',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [opts],
      validator: IsURLValidator,
    });
  };
}
