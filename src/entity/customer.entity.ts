import * as Joi from 'joi';
import { ValidationResult } from 'joi';
import { Parsed } from '../lib/validation.lib';

export interface CustomerDto {
  email: string;
  phone: string;
}

export type Customer = CustomerDto;

export class ZapayCustomer {
  static readonly customerValidationSchema: Joi.ObjectSchema = Joi.object({
    email: Joi.string().email(),
    phone: Joi.string().pattern(/[0-9]{11}/),
  });

  private static validate(dto: CustomerDto): ValidationResult {
    return this.customerValidationSchema.validate(dto);
  }

  static fromDto(dto: CustomerDto): Parsed<Customer> {
    return this.validate(dto);
  }

  static toDto(customer: Customer): CustomerDto {
    return customer;
  }
}
