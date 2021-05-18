import { HttpClient, RequestBuilder } from './lib/requestBuilder.lib';
import { ZapayService } from './service/zapay.service';
import { AuthenticationUseCase } from './usecase/authentication.usecase';
import { CheckOrderUseCase } from './usecase/checkOrder.usecase';
import { CheckoutUseCase } from './usecase/checkout.usecase';
import { ConfirmationResponse, ConfirmationUseCase } from './usecase/confirmation.usecase';
import { DebtsResponse, DebtsUseCase } from './usecase/debts.usecase';
import { InstallmentsResponse, InstallmentsUseCase } from './usecase/installments.usecase';
import { VehicleResponse, VehicleUseCase } from './usecase/vehicle.usecase';
import { WebhookRegisterUseCase } from './usecase/webhookRegister.usecase';
import { OrderDto, ZapayOrder } from './entity/order.entity';
import { BillDto, ZapayBill } from './entity/bill.entity';
import { Debt, DebtDto, ZapayDebt } from './entity/debt.entity';
import { Card, CardDto, ZapayCard } from './entity/card.entity';
import { Pix, PixDto, ZapayPix } from './entity/pix.entity';
import { ClientDetails, ClientDetailsDto, ZapayClientDetails } from './entity/clientDetails.entity';
import { Customer, CustomerDto, ZapayCustomer } from './entity/customer.entity';
import { State, ZapayState } from './entity/state.entity';
import { ConfirmationDto, ZapayConfirmation } from './entity/confirmation.entity';
import { Plate, ZapayPlate } from './entity/plate.entity';
import { Renavam, ZapayRenavam } from './entity/renavam.entity';
import {
  CompleteVehicleDto,
  SimpleVehicleDto,
  ZapayCompleteVehicle,
  ZapaySimpleVehicle,
} from './entity/vehicle.entity';
import { InstallmentPlanDto, ZapayInstallmentPlan } from './entity/installmentPlan.entity';
import { Url, ZapayUrl } from './entity/url.entity';
import { WebhookReportDto, ZapayWebhook } from './entity/webhook.entity';
import { getValueOrThrow } from './lib/validation.lib';

export interface CheckOrderDtoResponse {
  order: OrderDto;
  bills: Array<BillDto>;
}

export interface CardCheckoutDtoResponse {
  success: boolean;
  status?: string;
}

export interface PixCheckoutDtoResponse {
  success: boolean;
  status?: string;
}

export interface ConfirmationDtoResponse {
  confirmations: Array<ConfirmationDto>;
}

export interface DebtsDtoResponse {
  protocol: string;
  debts: Array<DebtDto>;
  vehicle: CompleteVehicleDto;
}

export interface AsyncDebtsDtoResponse {
  protocol: string;
  status: 'processing';
}

export interface InstallmentsDtoResponse {
  installmentsPlans: Array<InstallmentPlanDto>;
}

export interface WebhookRegisterDtoResponse {
  success: boolean;
}

export interface WebhookAsyncResponse {
  protocol: string;
  status: string;
  message?: string;
  success?: boolean;
  pix?: {
    qr_code_url: string;
    qr_code_data: string;
    expiration_date: string;
  };
}

export interface WebhookReportDtoResponse {
  webhookReport: WebhookReportDto;
}

export interface VehicleDtoResponse {
  vehicle: SimpleVehicleDto;
}

export class Zapay {
  private readonly _authenticationUseCase: AuthenticationUseCase;
  private readonly _checkOrderUseCase: CheckOrderUseCase;
  private readonly _checkoutUseCase: CheckoutUseCase;
  private readonly _confirmationUseCase: ConfirmationUseCase;
  private readonly _debtsUseCase: DebtsUseCase;
  private readonly _installmentsUseCase: InstallmentsUseCase;
  private readonly _webhookRegisterUseCase: WebhookRegisterUseCase;
  private readonly _vehicleUseCase: VehicleUseCase;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor(
    authenticationUseCase: AuthenticationUseCase,
    checkOrderUseCase: CheckOrderUseCase,
    checkoutUseCase: CheckoutUseCase,
    confirmationUseCase: ConfirmationUseCase,
    debtsUseCase: DebtsUseCase,
    installmentsUseCase: InstallmentsUseCase,
    webhookRegisterUseCase: WebhookRegisterUseCase,
    vehicleUseCase: VehicleUseCase
  ) {
    this._authenticationUseCase = authenticationUseCase;
    this._checkOrderUseCase = checkOrderUseCase;
    this._checkoutUseCase = checkoutUseCase;
    this._confirmationUseCase = confirmationUseCase;
    this._debtsUseCase = debtsUseCase;
    this._installmentsUseCase = installmentsUseCase;
    this._webhookRegisterUseCase = webhookRegisterUseCase;
    this._vehicleUseCase = vehicleUseCase;
  }

  static async newInstance(username: string, password: string, baseUrl: string, client: HttpClient): Promise<Zapay> {
    const requestBuilder = new RequestBuilder(client);
    const zapayService = new ZapayService(requestBuilder, baseUrl);
    const authenticationUseCase = new AuthenticationUseCase(zapayService, username, password);
    await authenticationUseCase.authentication();

    const checkOrderUseCase = new CheckOrderUseCase(zapayService, authenticationUseCase.getTokenOrThrow);
    const checkoutUseCase = new CheckoutUseCase(zapayService, authenticationUseCase.getTokenOrThrow);
    const confirmationUseCase = new ConfirmationUseCase(zapayService, authenticationUseCase.getTokenOrThrow);
    const debtsUseCase = new DebtsUseCase(zapayService, authenticationUseCase.getTokenOrThrow);
    const installmentsUseCase = new InstallmentsUseCase(zapayService, authenticationUseCase.getTokenOrThrow);
    const webhookRegisterUseCase = new WebhookRegisterUseCase(zapayService, authenticationUseCase.getTokenOrThrow);
    const vehicleUseCase = new VehicleUseCase(zapayService, authenticationUseCase.getTokenOrThrow);

    return new Zapay(
      authenticationUseCase,
      checkOrderUseCase,
      checkoutUseCase,
      confirmationUseCase,
      debtsUseCase,
      installmentsUseCase,
      webhookRegisterUseCase,
      vehicleUseCase
    );
  }

  async checkOrder(protocol: string): Promise<CheckOrderDtoResponse> {
    const checkOrderResponse = await this._checkOrderUseCase.checkOrder(protocol);
    const order = ZapayOrder.toDto(checkOrderResponse.order);
    const bills = checkOrderResponse.bills.map((bill) => ZapayBill.toDto(bill));
    return { order, bills };
  }

  async cardCheckout(
    protocol: string,
    debtsDto: Array<DebtDto>,
    installmentPlan: number,
    cardDto: CardDto,
    coupon?: string,
    clientDetailsDto?: ClientDetailsDto,
    customerDto?: CustomerDto
  ): Promise<CardCheckoutDtoResponse> {
    const debts: Array<Debt> = debtsDto.map((debt) => getValueOrThrow(ZapayDebt.fromDto(debt)));
    const card: Card = getValueOrThrow(ZapayCard.fromDto(cardDto));
    const clientDetails: ClientDetails | undefined =
      clientDetailsDto && getValueOrThrow(ZapayClientDetails.fromDto(clientDetailsDto));
    const customer: Customer | undefined = customerDto && getValueOrThrow(ZapayCustomer.fromDto(customerDto));
    return await this._checkoutUseCase.cardCheckout(
      protocol,
      debts,
      installmentPlan,
      card,
      coupon,
      clientDetails,
      customer
    );
  }

  async pixCheckout(
    protocol: string,
    debtsDto: Array<DebtDto>,
    pixDto: PixDto,
    coupon?: string,
    clientDetailsDto?: ClientDetailsDto,
    customerDto?: CustomerDto
  ): Promise<PixCheckoutDtoResponse> {
    const debts: Array<Debt> = debtsDto.map((debt) => getValueOrThrow(ZapayDebt.fromDto(debt)));
    const pix: Pix = getValueOrThrow(ZapayPix.fromDto(pixDto));
    const clientDetails: ClientDetails | undefined =
      clientDetailsDto && getValueOrThrow(ZapayClientDetails.fromDto(clientDetailsDto));
    const customer: Customer | undefined = customerDto && getValueOrThrow(ZapayCustomer.fromDto(customerDto));
    return await this._checkoutUseCase.pixCheckout(protocol, debts, pix, coupon, clientDetails, customer);
  }

  async confirmation(protocol: string, stateRaw: string, debtsDto: Array<DebtDto>): Promise<ConfirmationDtoResponse> {
    const state: State = getValueOrThrow(ZapayState.fromRaw(stateRaw));
    const debts: Array<Debt> = debtsDto.map((debt) => getValueOrThrow(ZapayDebt.fromDto(debt)));
    const confirmationResponse: ConfirmationResponse = await this._confirmationUseCase.confirmation(
      protocol,
      state,
      debts
    );
    return {
      confirmations: confirmationResponse.confirmations.map((confirmation) => ZapayConfirmation.toDto(confirmation)),
    };
  }

  async debts(stateRaw: string, plateRaw: string, renavamRaw: string): Promise<DebtsDtoResponse> {
    const state: State = getValueOrThrow(ZapayState.fromRaw(stateRaw));
    const plate: Plate = getValueOrThrow(ZapayPlate.fromRaw(plateRaw));
    const renavam: Renavam = getValueOrThrow(ZapayRenavam.fromRaw(renavamRaw));
    const debtsResponse: DebtsResponse = await this._debtsUseCase.debts(state, plate, renavam);
    return {
      protocol: debtsResponse.protocol,
      debts: debtsResponse.debts.map((debt) => ZapayDebt.toDto(debt)),
      vehicle: ZapayCompleteVehicle.toDto(debtsResponse.vehicle),
    };
  }

  async asyncDebts(stateRaw: string, plateRaw: string, renavamRaw: string): Promise<AsyncDebtsDtoResponse> {
    const state: State = getValueOrThrow(ZapayState.fromRaw(stateRaw));
    const plate: Plate = getValueOrThrow(ZapayPlate.fromRaw(plateRaw));
    const renavam: Renavam = getValueOrThrow(ZapayRenavam.fromRaw(renavamRaw));
    return await this._debtsUseCase.asyncDebts(state, plate, renavam);
  }

  async installments(protocol: string, debtsDto: Array<DebtDto>, coupon?: string): Promise<InstallmentsDtoResponse> {
    const debts: Array<Debt> = debtsDto.map((debt) => getValueOrThrow(ZapayDebt.fromDto(debt)));
    const installmentsResponse: InstallmentsResponse = await this._installmentsUseCase.installments(
      protocol,
      debts,
      coupon
    );
    return {
      installmentsPlans: installmentsResponse.installmentsPlans.map((installmentPlan) =>
        ZapayInstallmentPlan.toDto(installmentPlan)
      ),
    };
  }

  async webhookRegister(urlRaw: string): Promise<WebhookRegisterDtoResponse> {
    const url: Url = getValueOrThrow(ZapayUrl.fromRaw(urlRaw));
    return await this._webhookRegisterUseCase.webhookRegister(url);
  }

  async webhookReport(webhookAsyncResponse: WebhookAsyncResponse): Promise<WebhookReportDtoResponse> {
    const webhookReportDto: WebhookReportDto = {
      protocol: webhookAsyncResponse.protocol,
      status: webhookAsyncResponse.status,
      message: webhookAsyncResponse.message,
      success: webhookAsyncResponse.success,
      pix: {
        qrCodeUrl: webhookAsyncResponse.pix?.qr_code_url || '',
        qrCodeData: webhookAsyncResponse.pix?.qr_code_data || '',
        expirationDate: webhookAsyncResponse.pix?.expiration_date || '',
      },
    };
    const webhookReport = getValueOrThrow(ZapayWebhook.fromDto(webhookReportDto));
    const webhookReportResponse = await this._webhookRegisterUseCase.webhookReport(webhookReport);
    return {
      webhookReport: ZapayWebhook.toDto(webhookReportResponse.webhookReport),
    };
  }

  async vehicle(plateRaw: string): Promise<VehicleDtoResponse> {
    const plate: Plate = getValueOrThrow(ZapayPlate.fromRaw(plateRaw));
    const vehicleResponse: VehicleResponse = await this._vehicleUseCase.vehicle(plate);
    return {
      vehicle: ZapaySimpleVehicle.toDto(vehicleResponse.vehicle),
    };
  }

  async destroy(): Promise<void> {
    await this._authenticationUseCase.destroy();
  }
}
