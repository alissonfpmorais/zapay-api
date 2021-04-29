import * as Joi from 'joi';
import { ValidationResult } from 'joi';
import { BillingAddress, BillingAddressDto, ZapayBillingAddress } from './billingAddress.entity';
import { Parsed } from '../lib/validation.lib';

export interface CardDto {
  document: string;
  number: string;
  brand: string;
  holder: string;
  expirationDate: string;
  cvv: string;
  billingAddress: BillingAddressDto;
}

export interface Card {
  document: string;
  number: string;
  brand: string;
  holder: string;
  expirationDate: string;
  cvv: string;
  billingAddress: BillingAddress;
}

export class ZapayCard {
  static readonly cardValidationSchema: Joi.ObjectSchema = Joi.object({
    document: Joi.string().pattern(/[0-9]{11}|[0-9]{14}/),
    number: Joi.string().pattern(/[0-9]{13,}/),
    brand: Joi.string().min(2),
    holder: Joi.string().min(2),
    expirationDate: Joi.string().pattern(/[0-9]{4}/),
    cvv: Joi.string().min(2),
    billingAddress: ZapayBillingAddress.billingAddressValidationSchema,
  });

  private static validate(dto: CardDto): ValidationResult {
    return this.cardValidationSchema.validate(dto);
  }

  static fromDto(dto: CardDto): Parsed<Card> {
    return this.validate(dto);
  }

  static toDto(card: Card): CardDto {
    return card;
  }
}
