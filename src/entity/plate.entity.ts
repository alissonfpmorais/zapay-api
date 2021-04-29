import * as Joi from 'joi';
import { ValidationResult } from 'joi';
import { Parsed } from '../lib/validation.lib';

export interface Plate {
  kind: 'plate';
  plate: string;
}

export class ZapayPlate {
  static readonly plateValidationSchema: Joi.StringSchema = Joi.string()
    .uppercase()
    .pattern(/^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$/);

  private static validate(maybePlate: string): ValidationResult {
    return this.plateValidationSchema.validate(maybePlate);
  }

  static fromRaw(maybePlate: string): Parsed<Plate> {
    const { error, value } = this.validate(maybePlate);
    return { error, value: { kind: 'plate', plate: value } };
  }

  static toRaw(plate: Plate): string {
    return plate.plate;
  }
}
