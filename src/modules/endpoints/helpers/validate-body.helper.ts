import { HttpException } from '@nestjs/common';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

export function validateBody(schema: object, body: Record<string, unknown>) {
  const validate = ajv.compile(schema);
  const valid = validate(body);

  if (!valid) {
    const errors = (validate.errors ?? []).map(
      (e) => `${e.instancePath || 'body'} ${e.message}`,
    );
    throw new HttpException(
      { message: errors, error: 'Unprocessable Entity', statusCode: 422 },
      422,
    );
  }
}
