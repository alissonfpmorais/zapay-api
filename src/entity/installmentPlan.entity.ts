import * as Joi from 'joi';
import { ValidationResult } from 'joi';
import { Parsed } from '../lib/validation.lib';

export const creditInstallmentType = 'credit';

export type InstallmentType = typeof creditInstallmentType;

export interface InstallmentPlanDto {
  installments: number;
  amountInCents: number;
  totalAmountInCents: number;
  installmentType: string;
  feePercent: number;
  mayApplyCoupon: boolean;
  monthlyFeePercent: number;
}

export interface InstallmentPlan {
  installments: number;
  amountInCents: number;
  totalAmountInCents: number;
  installmentType: InstallmentType;
  feePercent: number;
  mayApplyCoupon: boolean;
  monthlyFeePercent: number;
}

export class ZapayInstallmentPlan {
  static readonly confirmationValidationSchema: Joi.ObjectSchema = Joi.object({
    installments: Joi.number().positive().integer(),
    amountInCents: Joi.number().positive().integer(),
    totalAmountInCents: Joi.number().positive().integer().min(Joi.ref('amountInCents')),
    installmentType: Joi.string().valid(creditInstallmentType),
    feePercent: Joi.number().integer().min(0).max(10000),
    mayApplyCoupon: Joi.boolean(),
    monthlyFeePercent: Joi.number().integer().min(0).max(10000),
  });

  private static validate(dto: InstallmentPlanDto): ValidationResult {
    return this.confirmationValidationSchema.validate(dto);
  }

  static fromDto(dto: InstallmentPlanDto): Parsed<InstallmentPlan> {
    return this.validate(dto);
  }

  static toDto(installmentPlan: InstallmentPlan): InstallmentPlanDto {
    return installmentPlan;
  }
}
