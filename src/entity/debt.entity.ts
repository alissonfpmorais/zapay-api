/* eslint-disable no-prototype-builtins */
import * as Joi from 'joi';
import { ValidationResult } from 'joi';
import { hasKey, Parsed } from '../lib/validation.lib';

export const ipvaDebtType = 'ipva';

export const licensingDebtType = 'licensing';

export const ticketDebtType = 'ticket';

export type DebtType = typeof ipvaDebtType | typeof licensingDebtType | typeof ticketDebtType;

export interface DebtDto {
  id: string;
  amountInCents: number;
  title: string;
  debtType: string;
  description: string;
  dueDate: string;
  required?: boolean;
  dependsOn?: Array<string>;
  distinct?: Array<string>;
}

export interface Debt {
  id: string;
  amountInCents: number;
  title: string;
  debtType: DebtType;
  description: string;
  dueDate: Date;
  required?: boolean;
  dependsOn?: Array<string>;
  distinct?: Array<string>;
}

export class ZapayDebt {
  static readonly debtValidationSchema: Joi.ObjectSchema = Joi.object({
    id: Joi.string().min(2),
    amountInCents: Joi.number().positive().integer(),
    title: Joi.string().min(2),
    debtType: Joi.string().valid(ipvaDebtType, licensingDebtType, ticketDebtType),
    description: Joi.string().min(2),
    dueDate: Joi.date(),
    required: Joi.boolean(),
    dependsOn: Joi.array().items(Joi.string().min(2)),
    distinct: Joi.array().items(Joi.string().min(2)),
  });

  private static validate(dto: DebtDto): ValidationResult {
    return this.debtValidationSchema.validate(dto);
  }

  static fromDto(dto: DebtDto): Parsed<Debt> {
    const { error, value } = this.validate(dto);
    if (error) return { error };
    const newValue: Debt = {
      id: value.id,
      amountInCents: value.amountInCents,
      title: value.title,
      debtType: value.debtType,
      description: value.description,
      dueDate: new Date(value.dueDate),
    };
    if (hasKey(value, 'required')) newValue['required'] = value.required;
    if (hasKey(value, 'dependsOn')) newValue['dependsOn'] = value.dependsOn;
    if (hasKey(value, 'distinct')) newValue['distinct'] = value.distinct;
    return { value: newValue };
  }

  static toDto(debt: Debt): DebtDto {
    const dto: DebtDto = {
      id: debt.id,
      amountInCents: debt.amountInCents,
      title: debt.title,
      debtType: debt.debtType,
      description: debt.description,
      dueDate: debt.dueDate.toISOString(),
    };
    if (hasKey(debt, 'required')) dto['required'] = debt.required;
    if (hasKey(debt, 'dependsOn')) dto['dependsOn'] = debt.dependsOn;
    if (hasKey(debt, 'distinct')) dto['distinct'] = debt.distinct;
    return dto;
  }
}
