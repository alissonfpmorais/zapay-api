import { Token } from '../entity/token.entity';
import { Debt } from '../entity/debt.entity';
import { Card } from '../entity/card.entity';
import { ProtocolStatus } from '../entity/protocol.entity';
import { ClientDetails } from '../entity/clientDetails.entity';
import { Customer } from '../entity/customer.entity';
import { Pix } from '../entity/pix.entity';

export interface CardCheckoutResponse {
  success: boolean;
  status?: ProtocolStatus;
}

export interface PixCheckoutResponse {
  success: boolean;
  status?: ProtocolStatus;
}

export interface ICheckoutService {
  cardCheckout(
    token: Token,
    protocol: string,
    debts: Array<Debt>,
    installmentPlan: number,
    card: Card,
    coupon?: string,
    clientDetails?: ClientDetails,
    customer?: Customer
  ): Promise<CardCheckoutResponse>;
  pixCheckout(
    token: Token,
    protocol: string,
    debts: Array<Debt>,
    pix: Pix,
    coupon?: string,
    clientDetails?: ClientDetails,
    customer?: Customer
  ): Promise<PixCheckoutResponse>;
}

export class CheckoutUseCase {
  private readonly _checkoutService: ICheckoutService;
  private readonly _getToken: () => Token;

  constructor(checkoutService: ICheckoutService, getToken: () => Token) {
    this._checkoutService = checkoutService;
    this._getToken = getToken;
  }

  async cardCheckout(
    protocol: string,
    debts: Array<Debt>,
    installmentPlan: number,
    card: Card,
    coupon?: string,
    clientDetails?: ClientDetails,
    customer?: Customer
  ): Promise<CardCheckoutResponse> {
    const token = this._getToken();
    return this._checkoutService.cardCheckout(
      token,
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
    debts: Array<Debt>,
    pix: Pix,
    coupon?: string,
    clientDetails?: ClientDetails,
    customer?: Customer
  ): Promise<PixCheckoutResponse> {
    const token = this._getToken();
    return this._checkoutService.pixCheckout(token, protocol, debts, pix, coupon, clientDetails, customer);
  }
}
