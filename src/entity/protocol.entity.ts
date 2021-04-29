export const searchStatus = 'SEARCH';

export const simulationStatus = 'SIMULATION';

export const checkoutSuccessStatus = 'CHECKOUT_SUCCESS';

export const vehicleNotFoundStatus = 'VEHICLE_NOT_FOUND';

export const vehicleWithoutDebtsStatus = 'VEHICLE_WITHOUT_DEBTS';

export const serviceUnavailableStatus = 'SERVICE_UNAVAILABLE';

export const checkoutFailStatus = 'CHECKOUT_FAIL';

export const paymentInitiatedStatus = 'PAYMENT_INITIATED';

export const barcodeEmittedStatus = 'BARCODE_EMITTED';

export type ProtocolStatus =
  | typeof searchStatus
  | typeof simulationStatus
  | typeof checkoutSuccessStatus
  | typeof vehicleNotFoundStatus
  | typeof vehicleWithoutDebtsStatus
  | typeof serviceUnavailableStatus
  | typeof checkoutFailStatus
  | typeof paymentInitiatedStatus
  | typeof barcodeEmittedStatus;
