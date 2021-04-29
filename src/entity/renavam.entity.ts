import * as Joi from 'joi';
import { ValidationResult } from 'joi';
import { Parsed } from '../lib/validation.lib';

export interface Renavam {
  kind: 'renavam';
  renavam: string;
}

interface ValidateResponse {
  value: string;
  errors: Joi.ErrorReport;
}

export function isValidRenavam(value: string): boolean {
  if (!value || value === '') return false;
  const baseSequence = [3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const valueAsNumber = value.replace(/[^0-9]/, '');
  if (!value || value === '' || value.length !== 11) return false;
  const chars = valueAsNumber.split('');
  const distinctChars = chars.reduce((acc: Record<string, number>, char) => {
    if (acc[char]) acc[char] += 1;
    else acc[char] = 1;
    return acc;
  }, {});
  if (distinctChars.length === 1) return false;
  const sum = chars.reduce((acc, char, index) => {
    if (index < 10) return acc + parseInt(char) * baseSequence[index];
    return acc;
  }, 0);
  const maybeValidationChar = (sum * 10) % 11;
  const validationChar = maybeValidationChar !== 10 ? maybeValidationChar : 0;
  return validationChar.toString() === chars[10];
}

export class ZapayRenavam {
  static readonly customJoi = Joi.extend((joi) => ({
    type: 'renavam',
    base: joi.string(),
    messages: {
      'renavam.invalid': '{{#label}} must be a valid renavam',
    },
    validate(value: string, helpers: Joi.CustomHelpers): ValidateResponse | string {
      return isValidRenavam(value) ? value : { value, errors: helpers.error('renavam.invalid') };
    },
  }));
  static readonly renavamValidationSchema = ZapayRenavam.customJoi.renavam();

  private static validate(maybeRenavam: string): ValidationResult {
    return this.renavamValidationSchema.validate(maybeRenavam);
  }

  static fromRaw(maybeRenavam: string): Parsed<Renavam> {
    const { error, value } = this.validate(maybeRenavam);
    return { error, value: { kind: 'renavam', renavam: value } };
  }

  static toRaw(renavam: Renavam): string {
    return renavam.renavam;
  }
}
