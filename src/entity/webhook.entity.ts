/* eslint-disable no-prototype-builtins */
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
import { hasKey, Parsed } from '../lib/validation.lib';

export interface WebhookReportDto {
  protocol: string;
  status: string;
  message?: string;
  success?: boolean;
  pix?: {
    qrCodeUrl: string;
    qrCodeData: string;
    expirationDate: string;
  };
}

export interface WebhookReport {
  protocol: string;
  status: ProtocolStatus;
  message?: string;
  success?: boolean;
  pix?: {
    qrCodeUrl: string;
    qrCodeData: string;
    expirationDate: Date;
  };
}

export class ZapayWebhook {
  static readonly webhookReportValidationSchema: Joi.ObjectSchema = Joi.object({
    protocol: Joi.string().empty(),
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
    message: Joi.string().optional(),
    success: Joi.boolean().optional(),
    pix: Joi.object({
      qrCodeUrl: Joi.string().empty(),
      qrCodeData: Joi.string().empty(),
      expirationDate: Joi.date().iso(),
    }).optional(),
  });

  private static validate(dto: WebhookReportDto): ValidationResult {
    return this.webhookReportValidationSchema.validate(dto);
  }

  private static fromResponseToReport(result: ValidationResult): Parsed<WebhookReport> {
    if (result.error) return { error: result.error };
    const value: WebhookReportDto = result.value;
    const newValue: WebhookReport = {
      protocol: value.protocol,
      status: value.status as ProtocolStatus,
    };
    if (hasKey(value, 'message')) newValue['message'] = value.message;
    if (hasKey(value, 'success')) newValue['success'] = value.success;
    if (hasKey(value, 'pix'))
      newValue['pix'] = {
        qrCodeUrl: value.pix?.qrCodeUrl || '',
        qrCodeData: value.pix?.qrCodeData || '',
        expirationDate: new Date(value.pix?.expirationDate || ''),
      };

    return { value: newValue };
  }

  static fromDto(dto: WebhookReportDto): Parsed<WebhookReport> {
    const result = this.validate(dto);
    return this.fromResponseToReport(result);
  }

  static toDto(webhookReport: WebhookReport): WebhookReportDto {
    const webhookReportDto: WebhookReportDto = {
      protocol: webhookReport.protocol,
      status: webhookReport.status,
    };
    if (hasKey(webhookReport, 'message')) webhookReportDto['message'] = webhookReport.message;
    if (hasKey(webhookReport, 'status')) webhookReportDto['status'] = webhookReport.status;
    if (hasKey(webhookReport, 'pix'))
      webhookReportDto['pix'] = {
        qrCodeUrl: webhookReport.pix?.qrCodeUrl || '',
        qrCodeData: webhookReport.pix?.qrCodeData || '',
        expirationDate: webhookReport.pix?.expirationDate.toISOString() || '',
      };

    return webhookReportDto;
  }
}
