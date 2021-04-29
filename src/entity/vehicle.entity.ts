/* eslint-disable no-prototype-builtins */
import * as Joi from 'joi';
import { ValidationResult } from 'joi';
import { Plate, ZapayPlate } from './plate.entity';
import { Renavam, ZapayRenavam } from './renavam.entity';
import { State, ZapayState } from './state.entity';
import { hasKey, isParsedError, Parsed } from '../lib/validation.lib';

export interface CompleteVehicleDto {
  renavam: string;
  plate: string;
  document?: string;
  owner?: string;
  model?: string;
  color?: string;
  fabricationYear?: number;
  modelYear?: number;
  chassis?: string;
  venalValue?: string;
}

export interface CompleteVehicle {
  renavam: Renavam;
  plate: Plate;
  document?: string;
  owner?: string;
  model?: string;
  color?: string;
  fabricationYear?: number;
  modelYear?: number;
  chassis?: string;
  venalValue?: string;
}

export interface SimpleVehicleDto {
  plate: string;
  renavam: string;
  state: string;
}

export interface SimpleVehicle {
  plate: Plate;
  renavam: Renavam;
  state: State;
}

export class ZapayCompleteVehicle {
  static readonly vehicleValidationSchema: Joi.ObjectSchema = Joi.object({
    renavam: ZapayRenavam.renavamValidationSchema,
    plate: ZapayPlate.plateValidationSchema,
    document: Joi.string()
      .pattern(/[0-9]{11}|[0-9]{14}/)
      .optional(),
    owner: Joi.string().optional(),
    model: Joi.string().optional(),
    color: Joi.string().optional(),
    fabricationYear: Joi.number().min(1900).max(new Date().getFullYear()).optional(),
    modelYear: Joi.alternatives()
      .try(Joi.number().equal(Joi.ref('fabricationYear')), Joi.expression('{ fabricationYear + 1 }'))
      .optional(),
    chassis: Joi.string().optional(),
    venalValue: Joi.string().optional(),
  });

  private static validate(dto: CompleteVehicleDto): ValidationResult {
    return this.vehicleValidationSchema.validate(dto);
  }

  private static fromDtoToVehicle(result: ValidationResult): Parsed<CompleteVehicle> {
    if (result.error) return { error: result.error };
    const value: CompleteVehicleDto = result.value;
    const parsedRenavam = ZapayRenavam.fromRaw(value.renavam);
    if (isParsedError(parsedRenavam)) return parsedRenavam;
    const parsedPlate = ZapayPlate.fromRaw(value.plate);
    if (isParsedError(parsedPlate)) return parsedPlate;
    const newValue: CompleteVehicle = {
      renavam: parsedRenavam.value,
      plate: parsedPlate.value,
    };
    if (hasKey(value, 'document')) newValue['document'] = value.document;
    if (hasKey(value, 'owner')) newValue['owner'] = value.owner;
    if (hasKey(value, 'model')) newValue['model'] = value.model;
    if (hasKey(value, 'color')) newValue['color'] = value.color;
    if (hasKey(value, 'fabricationYear')) newValue['fabricationYear'] = value.fabricationYear;
    if (hasKey(value, 'modelYear')) newValue['modelYear'] = value.modelYear;
    if (hasKey(value, 'chassis')) newValue['chassis'] = value.chassis;
    if (hasKey(value, 'venalValue')) newValue['venalValue'] = value.venalValue;
    return { value: newValue };
  }

  static fromDto(dto: CompleteVehicleDto): Parsed<CompleteVehicle> {
    const result = this.validate(dto);
    return this.fromDtoToVehicle(result);
  }

  static toDto(completeVehicle: CompleteVehicle): CompleteVehicleDto {
    return {
      ...completeVehicle,
      renavam: ZapayRenavam.toRaw(completeVehicle.renavam),
      plate: ZapayPlate.toRaw(completeVehicle.plate),
    };
  }
}

export class ZapaySimpleVehicle {
  static readonly vehicleValidationSchema: Joi.ObjectSchema = Joi.object({
    renavam: ZapayRenavam.renavamValidationSchema,
    plate: ZapayPlate.plateValidationSchema,
    state: ZapayState.stateValidationSchema,
  });

  private static validate(dto: SimpleVehicleDto): ValidationResult {
    return this.vehicleValidationSchema.validate(dto);
  }

  private static fromDtoToVehicle(result: ValidationResult): Parsed<SimpleVehicle> {
    if (result.error) return { error: result.error };
    const value: { renavam: string; plate: string; state: string } = result.value;
    const parsedRenavam = ZapayRenavam.fromRaw(value.renavam);
    if (isParsedError(parsedRenavam)) return parsedRenavam;
    const parsedPlate = ZapayPlate.fromRaw(value.plate);
    if (isParsedError(parsedPlate)) return parsedPlate;
    const parsedState = ZapayState.fromRaw(value.state);
    if (isParsedError(parsedState)) return parsedState;
    const newValue: SimpleVehicle = {
      renavam: parsedRenavam.value,
      plate: parsedPlate.value,
      state: parsedState.value,
    };
    return { value: newValue };
  }

  static fromDto(dto: SimpleVehicleDto): Parsed<SimpleVehicle> {
    const result = this.validate(dto);
    return this.fromDtoToVehicle(result);
  }

  static toDto(simpleVehicle: SimpleVehicle): SimpleVehicleDto {
    return {
      ...simpleVehicle,
      plate: ZapayPlate.toRaw(simpleVehicle.plate),
      renavam: ZapayRenavam.toRaw(simpleVehicle.renavam),
      state: ZapayState.toRaw(simpleVehicle.state),
    };
  }
}
