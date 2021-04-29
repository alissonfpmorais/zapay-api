/* eslint-disable no-prototype-builtins */
import { ValidationError } from 'joi';

export interface ParsedError {
  error: ValidationError;
}

export interface ParsedValue<Value> {
  value: Value;
}

export type Parsed<Value> = ParsedError | ParsedValue<Value>;

export function hasKey(obj: unknown, key: string): boolean {
  return (
    typeof obj === 'object' &&
    obj !== undefined &&
    obj !== null &&
    obj.hasOwnProperty(key) &&
    (obj as Record<string, unknown>)[key] !== undefined
  );
}

export function isParsedError<Value>(parsed: Parsed<Value>): parsed is ParsedError {
  return !!(parsed as ParsedError).error;
}

export function throwParsedError(parsedError: ParsedError): void {
  throw new Error(JSON.stringify(parsedError));
}

export function getValueOrThrow<Value>(parsed: Parsed<Value>): Value {
  if (isParsedError(parsed)) throwParsedError(parsed);
  return (parsed as ParsedValue<Value>).value;
}
