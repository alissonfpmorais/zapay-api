import * as Joi from 'joi';
import { ValidationResult } from 'joi';
import { Parsed } from '../lib/validation.lib';

export interface ClientDetailsDto {
  cartToken: string;
}

export type ClientDetails = ClientDetailsDto;

export class ZapayClientDetails {
  static readonly clientDetailsValidationSchema: Joi.ObjectSchema = Joi.object({
    cartToken: Joi.string(),
  });

  private static validate(dto: ClientDetailsDto): ValidationResult {
    return this.clientDetailsValidationSchema.validate(dto);
  }

  static fromDto(dto: ClientDetailsDto): Parsed<ClientDetails> {
    return this.validate(dto);
  }

  static toDto(clientDetails: ClientDetails): ClientDetailsDto {
    return clientDetails;
  }
}
