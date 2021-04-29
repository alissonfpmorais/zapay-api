import * as Joi from 'joi';
import { ValidationResult } from 'joi';
import { DebtType, ipvaDebtType, licensingDebtType, ticketDebtType } from './debt.entity';
import { Parsed } from '../lib/validation.lib';

export interface ConfirmationDto {
  id: string;
  amountInCents: number;
  debtYear: number;
  debtType: string;
}

export interface Confirmation {
  id: string;
  amountInCents: number;
  debtYear: number;
  debtType: DebtType;
}

export class ZapayConfirmation {
  static readonly confirmationValidationSchema: Joi.ObjectSchema = Joi.object({
    id: Joi.string().min(2),
    amountInCents: Joi.number().positive().integer(),
    debtYear: Joi.number().min(1900).max(new Date().getFullYear()),
    debtType: Joi.string().valid(ipvaDebtType, licensingDebtType, ticketDebtType),
  });

  private static validate(dto: ConfirmationDto): ValidationResult {
    return this.confirmationValidationSchema.validate(dto);
  }

  static fromDto(dto: ConfirmationDto): Parsed<Confirmation> {
    return this.validate(dto);
  }

  static toDto(confirmation: Confirmation): ConfirmationDto {
    return confirmation;
  }
}
