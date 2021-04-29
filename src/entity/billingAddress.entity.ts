import * as Joi from 'joi';
import { ValidationResult } from 'joi';
import { Parsed } from '../lib/validation.lib';

export interface BillingAddressDto {
  zipCode: string;
  address: string;
  neighborhood: string;
  city: string;
  number: string;
}

export type BillingAddress = BillingAddressDto;

export class ZapayBillingAddress {
  static readonly billingAddressValidationSchema: Joi.ObjectSchema = Joi.object({
    zipCode: Joi.string().min(8).optional(),
    address: Joi.string().optional(),
    neighborhood: Joi.string().optional(),
    city: Joi.string().optional(),
    number: Joi.string().optional(),
  });

  private static validate(maybeBillingAddress: BillingAddress): ValidationResult {
    return this.billingAddressValidationSchema.validate(maybeBillingAddress);
  }

  static fromDto(dto: BillingAddressDto): Parsed<BillingAddress> {
    return this.validate(dto);
  }

  static toDto(billingAddress: BillingAddress): BillingAddressDto {
    return billingAddress;
  }
}
