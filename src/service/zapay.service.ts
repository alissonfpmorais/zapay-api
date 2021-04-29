import { IRequestBuilder, Method, RequestOptions, RequestResponse } from '../lib/requestBuilder.lib';
import { IAuthenticationService } from '../usecase/authentication.usecase';
import { AsyncDebtsResponse, DebtsResponse, IDebtsService } from '../usecase/debts.usecase';
import { ConfirmationResponse, IConfirmationService } from '../usecase/confirmation.usecase';
import { CheckOrderResponse, ICheckOrderService } from '../usecase/checkOrder.usecase';
import { CardCheckoutResponse, ICheckoutService, PixCheckoutResponse } from '../usecase/checkout.usecase';
import { IWebhookRegisterService, WebhookRegisterResponse } from '../usecase/webhookRegister.usecase';
import { IVehicleService, VehicleResponse } from '../usecase/vehicle.usecase';
import { Token, ZapayToken } from '../entity/token.entity';
import { Debt, ZapayDebt } from '../entity/debt.entity';
import { ClientDetails } from '../entity/clientDetails.entity';
import { Customer } from '../entity/customer.entity';
import { State, ZapayState } from '../entity/state.entity';
import { Plate, ZapayPlate } from '../entity/plate.entity';
import { Renavam, ZapayRenavam } from '../entity/renavam.entity';
import { ZapayCompleteVehicle, ZapaySimpleVehicle } from '../entity/vehicle.entity';
import { ZapayConfirmation } from '../entity/confirmation.entity';
import { ZapayOrder } from '../entity/order.entity';
import { ZapayBill } from '../entity/bill.entity';
import { InstallmentsResponse } from '../usecase/installments.usecase';
import { ZapayInstallmentPlan } from '../entity/installmentPlan.entity';
import { Card } from '../entity/card.entity';
import { Pix } from '../entity/pix.entity';
import { Url, ZapayUrl } from '../entity/url.entity';
import { getValueOrThrow } from '../lib/validation.lib';

interface ErrorResponse {
  detail: string;
  error: string;
}

interface AuthenticationDtoResponse {
  token: string;
}

interface DebtsDtoResponse {
  protocol: string;
  debts: Array<{
    id: string;
    amount: number;
    title: string;
    type: string;
    description: string;
    due_date: string;
    required?: boolean;
    depends_on?: Array<string>;
    distinct?: Array<string>;
  }>;
  vehicle: {
    renavam: string;
    license_plate: string;
    document?: string;
    owner?: string;
    model?: string;
    color?: string;
    fabrication_year?: number;
    model_year?: number;
    chassi?: string;
    venal_value?: string;
  };
}

interface AsyncDebtsDtoResponse {
  protocol: string;
  status: 'processing';
}

interface ConfirmationDtoResponse {
  confirmation: Array<{
    id: string;
    amount: number;
    year: number;
    type: string;
  }>;
}

interface CheckOrderDtoResponse {
  order: {
    status: string;
  };
  bills: Array<{
    id: string;
    amount: number;
    status: string;
    authorization_code: string;
  }>;
}

interface InstallmentsDtoResponse {
  installmentsPlans: Array<{
    installments: number;
    amount: number;
    total_amount: number;
    type: string;
    fee: number;
    coupon: boolean;
    monthly_fee: number;
  }>;
}

export interface WebhookSyncResponse {
  success: boolean;
}

interface VehicleDtoResponse {
  license_plate: string;
  renavam: string;
  uf: string;
}

export class ZapayService
  implements
    IAuthenticationService,
    IDebtsService,
    IConfirmationService,
    ICheckOrderService,
    ICheckoutService,
    IWebhookRegisterService,
    IVehicleService {
  private readonly _httpClient: IRequestBuilder;
  private readonly _baseUrl: string;

  constructor(httpClient: IRequestBuilder, baseUrl?: string) {
    this._httpClient = httpClient;
    this._baseUrl = baseUrl || process?.env?.ZAPAY_API_URL || 'https://api.sandbox.usezapay.com.br';
  }

  private static toCents(value: number): number {
    return Math.floor(value * 100);
  }

  private async request<Response>(
    method: Method,
    path: string,
    token?: Token,
    body?: Record<string, unknown> | null,
    headers?: Record<string, unknown> | null
  ): Promise<Response> {
    const authorizationHeader = token ? { Authorization: `JWT ${ZapayToken.toRaw(token)}` } : {};
    const options: RequestOptions = {
      url: this._baseUrl + path,
      method: method,
      headers: headers ? { ...headers, ...authorizationHeader } : authorizationHeader,
    };
    if (body) options['data'] = body;
    const response: RequestResponse<Response> = await this._httpClient.request(options);
    const data = response.status === 200 && (response.data as Response);
    if (!data) {
      const error = (response.status >= 400 &&
        response.status < 500 &&
        ((response.data as unknown) as ErrorResponse)) || {
        detail: 'Não foi possível completar a request',
        error: 'Erro Desconhecido',
      };
      throw new Error(JSON.stringify(error));
    }
    return data;
  }

  private async getRequest<Response>(path: string, token?: Token): Promise<Response> {
    return this.request('GET' as Method, path, token, null, null);
  }

  private async postRequest<Response>(path: string, body: Record<string, unknown>, token?: Token): Promise<Response> {
    const contentTypeHeader = { 'Content-Type': 'application/json' };
    return this.request('POST' as Method, path, token, body, contentTypeHeader);
  }

  private async checkout<Response extends CardCheckoutResponse | PixCheckoutResponse>(
    token: Token,
    body: Record<string, unknown>,
    debts: Array<Debt>,
    coupon?: string,
    clientDetails?: ClientDetails,
    customer?: Customer
  ): Promise<Response> {
    body['debts'] = debts.map((debt) => debt.id);
    if (coupon) body['promotional_ticket'] = coupon;
    if (clientDetails) body['client_details'] = clientDetails;
    if (customer) body['customer'] = customer;

    return this.postRequest('/zapi/checkout/', body, token);
  }

  async authentication(username: string, password: string): Promise<Token> {
    const data = await this.postRequest<AuthenticationDtoResponse>('/authentication/', { username, password });
    const maybeToken = ZapayToken.fromRaw(data.token);
    return getValueOrThrow(maybeToken);
  }

  async debts(token: Token, state: State, plate: Plate, renavam: Renavam): Promise<DebtsResponse> {
    const debtsResponse = await this.postRequest<DebtsDtoResponse>(
      '/zapi/debts/',
      { state: ZapayState.toRaw(state), license_plate: ZapayPlate.toRaw(plate), renavam: ZapayRenavam.toRaw(renavam) },
      token
    );
    const debts = debtsResponse.debts?.map((debt) =>
      getValueOrThrow(
        ZapayDebt.fromDto({
          id: debt.id,
          amountInCents: ZapayService.toCents(debt.amount),
          title: debt.title,
          debtType: debt.type,
          description: debt.description,
          dueDate: debt.due_date,
          required: debt.required,
          dependsOn: debt.depends_on,
          distinct: debt.distinct,
        })
      )
    );
    const vehicle = getValueOrThrow(
      ZapayCompleteVehicle.fromDto({
        renavam: debtsResponse.vehicle?.renavam,
        plate: debtsResponse.vehicle?.license_plate,
        document: debtsResponse.vehicle?.document,
        owner: debtsResponse.vehicle?.owner,
        model: debtsResponse.vehicle?.model,
        color: debtsResponse.vehicle?.color,
        fabricationYear: debtsResponse.vehicle?.fabrication_year,
        modelYear: debtsResponse.vehicle?.model_year,
        chassis: debtsResponse.vehicle?.chassi,
        venalValue: debtsResponse.vehicle?.venal_value,
      })
    );

    return { protocol: debtsResponse.protocol, debts, vehicle };
  }

  async asyncDebts(token: Token, state: State, plate: Plate, renavam: Renavam): Promise<AsyncDebtsResponse> {
    return this.postRequest<AsyncDebtsDtoResponse>(
      '/zapi/debts/?async=true',
      { state: ZapayState.toRaw(state), license_plate: ZapayPlate.toRaw(plate), renavam: ZapayRenavam.toRaw(renavam) },
      token
    );
  }

  async confirmation(token: Token, protocol: string, state: State, debts: Array<Debt>): Promise<ConfirmationResponse> {
    const confirmationResponse = await this.postRequest<ConfirmationDtoResponse>(
      '/zapi/confirmation/',
      { protocol, state: ZapayState.toRaw(state), ids: debts.map((debt) => debt.id) },
      token
    );
    const confirmations = confirmationResponse.confirmation?.map((confirmation) =>
      getValueOrThrow(
        ZapayConfirmation.fromDto({
          id: confirmation.id,
          amountInCents: ZapayService.toCents(confirmation.amount),
          debtYear: confirmation.year,
          debtType: confirmation.type,
        })
      )
    );

    return { confirmations };
  }

  async checkOrder(token: Token, protocol: string): Promise<CheckOrderResponse> {
    const checkOrderResponse = await this.postRequest<CheckOrderDtoResponse>('/zapi/order/', { protocol }, token);

    return {
      order: getValueOrThrow(ZapayOrder.fromDto(checkOrderResponse.order)),
      bills: checkOrderResponse.bills?.map((bill) =>
        getValueOrThrow(
          ZapayBill.fromDto({
            id: bill.id,
            amountInCents: ZapayService.toCents(bill.amount),
            status: bill.status,
            authorizationCode: bill.authorization_code,
          })
        )
      ),
    };
  }

  async installments(
    token: Token,
    protocol: string,
    debts: Array<Debt>,
    coupon?: string
  ): Promise<InstallmentsResponse> {
    const installmentsResponse = await this.postRequest<InstallmentsDtoResponse>(
      '/zapi/installments/',
      {
        protocol,
        debts: debts.map((debt) => debt.id),
        promotional_ticket: coupon,
      },
      token
    );
    const installmentsPlans = installmentsResponse.installmentsPlans?.map((installmentPlan) =>
      getValueOrThrow(
        ZapayInstallmentPlan.fromDto({
          installments: installmentPlan.installments,
          amountInCents: ZapayService.toCents(installmentPlan.amount),
          totalAmountInCents: ZapayService.toCents(installmentPlan.total_amount),
          installmentType: installmentPlan.type,
          feePercent: ZapayService.toCents(installmentPlan.fee),
          mayApplyCoupon: installmentPlan.coupon,
          monthlyFeePercent: ZapayService.toCents(installmentPlan.monthly_fee),
        })
      )
    );
    return { installmentsPlans };
  }

  async cardCheckout(
    token: Token,
    protocol: string,
    debts: Array<Debt>,
    installmentPlan: number,
    card: Card,
    coupon?: string,
    clientDetails?: ClientDetails,
    customer?: Customer
  ): Promise<CardCheckoutResponse> {
    const body: Record<string, unknown> = { protocol, card, installmentPlan };
    return this.checkout(token, body, debts, coupon, clientDetails, customer);
  }

  async pixCheckout(
    token: Token,
    protocol: string,
    debts: Array<Debt>,
    pix: Pix,
    coupon?: string,
    clientDetails?: ClientDetails,
    customer?: Customer
  ): Promise<PixCheckoutResponse> {
    const body: Record<string, unknown> = { protocol, pix };
    return this.checkout(token, body, debts, coupon, clientDetails, customer);
  }

  async webhookRegister(token: Token, url: Url): Promise<WebhookRegisterResponse> {
    return this.postRequest<WebhookSyncResponse>('/zapi/endpoint-register/', { url: ZapayUrl.toRaw(url) }, token);
  }

  async vehicle(token: Token, plate: Plate): Promise<VehicleResponse> {
    const path = `/zapi/vehicle/${plate.plate}`;
    const vehicleResponse = await this.getRequest<VehicleDtoResponse>(path, token);
    const vehicle = getValueOrThrow(
      ZapaySimpleVehicle.fromDto({
        plate: vehicleResponse.license_plate,
        renavam: vehicleResponse.renavam,
        state: vehicleResponse.uf,
      })
    );
    return { vehicle };
  }
}
