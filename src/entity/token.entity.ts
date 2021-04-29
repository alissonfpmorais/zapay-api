import * as Joi from 'joi';
import { ValidationResult } from 'joi';
import { Parsed } from '../lib/validation.lib';

export interface Token {
  kind: 'token';
  token: string;
}

export class ZapayToken {
  static readonly tokenValidationSchema = Joi.string().pattern(
    /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/
  );

  private static validate(maybeToken: string): ValidationResult {
    return this.tokenValidationSchema.validate(maybeToken);
  }

  static fromRaw(maybeToken: string): Parsed<Token> {
    const { error, value } = this.validate(maybeToken);
    return { error, value: { kind: 'token', token: value } };
  }

  static toRaw(token: Token): string {
    return token.token;
  }
}
