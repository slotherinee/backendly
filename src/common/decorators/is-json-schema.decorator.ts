import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import Ajv from 'ajv';

const ajv = new Ajv();

@ValidatorConstraint({ name: 'isJsonSchema', async: false })
class IsJsonSchemaConstraint implements ValidatorConstraintInterface {
  validate(value: unknown) {
    if (typeof value !== 'object' || value === null || Array.isArray(value))
      return false;
    return ajv.validateSchema(value) as boolean;
  }

  defaultMessage() {
    return 'validationSchema must be a valid JSON Schema object';
  }
}

export function IsJsonSchema(options?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options,
      constraints: [],
      validator: IsJsonSchemaConstraint,
    });
  };
}
