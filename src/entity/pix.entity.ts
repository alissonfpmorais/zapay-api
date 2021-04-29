import * as Joi from 'joi';
import { ValidationResult } from 'joi';
import { Parsed } from '../lib/validation.lib';

export interface PixDto {
  document: string;
  name: string;
}

export type Pix = PixDto;

export class ZapayPix {
  static readonly pixValidationSchema: Joi.ObjectSchema = Joi.object({
    document: Joi.string().pattern(/[0-9]{11}|[0-9]{14}/),
    name: Joi.string().min(2),
  });

  private static validate(dto: PixDto): ValidationResult {
    return this.pixValidationSchema.validate(dto);
  }

  static fromDto(dto: PixDto): Parsed<Pix> {
    return this.validate(dto);
  }

  static toDto(pix: Pix): PixDto {
    return pix;
  }
}
