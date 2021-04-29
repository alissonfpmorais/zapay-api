import * as Joi from 'joi';
import { ValidationResult } from 'joi';
import { Parsed } from '../lib/validation.lib';

export const awaitingStatus = 'awaiting_payment';

export const settledStatus = 'settled';

export type BillStatus = typeof awaitingStatus | typeof settledStatus;

export interface BillDto {
  id: string;
  amountInCents: number;
  status: string;
  authorizationCode?: string;
}

export interface Bill {
  id: string;
  amountInCents: number;
  status: BillStatus;
  authorizationCode?: string;
}

export class ZapayBill {
  static readonly billValidationSchema: Joi.ObjectSchema = Joi.object({
    id: Joi.string().min(2),
    amountInCents: Joi.number().positive().integer(),
    status: Joi.string().valid(awaitingStatus, settledStatus),
    authorizationCode: Joi.string().min(2),
  });

  private static validate(dto: BillDto): ValidationResult {
    return this.billValidationSchema.validate(dto);
  }

  static fromDto(dto: BillDto): Parsed<Bill> {
    return this.validate(dto);
  }

  static toDto(bill: Bill): BillDto {
    return bill;
  }
}
