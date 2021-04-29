import * as Joi from 'joi';
import { ValidationResult } from 'joi';
import {
  barcodeEmittedStatus,
  checkoutFailStatus,
  checkoutSuccessStatus,
  paymentInitiatedStatus,
  ProtocolStatus,
  searchStatus,
  serviceUnavailableStatus,
  simulationStatus,
  vehicleNotFoundStatus,
  vehicleWithoutDebtsStatus,
} from './protocol.entity';
import { Parsed } from '../lib/validation.lib';

export interface OrderDto {
  status: string;
}

export interface Order {
  status: ProtocolStatus;
}

export class ZapayOrder {
  static readonly orderValidationSchema: Joi.ObjectSchema = Joi.object({
    status: Joi.string().valid(
      searchStatus,
      simulationStatus,
      checkoutSuccessStatus,
      vehicleNotFoundStatus,
      vehicleWithoutDebtsStatus,
      serviceUnavailableStatus,
      checkoutFailStatus,
      paymentInitiatedStatus,
      barcodeEmittedStatus
    ),
  });

  private static validate(dto: OrderDto): ValidationResult {
    return this.orderValidationSchema.validate(dto);
  }

  static fromDto(dto: OrderDto): Parsed<Order> {
    return this.validate(dto);
  }

  static toDto(order: Order): OrderDto {
    return order;
  }
}
