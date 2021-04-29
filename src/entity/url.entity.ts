import * as Joi from 'joi';
import { ValidationResult } from 'joi';
import { Parsed } from '../lib/validation.lib';

export interface Url {
  kind: 'url';
  url: string;
}

export class ZapayUrl {
  static readonly urlValidationSchema: Joi.StringSchema = Joi.string()
    .uppercase()
    .pattern(/^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$/);

  private static validate(maybeUrl: string): ValidationResult {
    return this.urlValidationSchema.validate(maybeUrl);
  }

  static fromRaw(maybeUrl: string): Parsed<Url> {
    return this.validate(maybeUrl);
  }

  static toRaw(url: Url): string {
    return url.url;
  }
}
