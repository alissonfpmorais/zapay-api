import { Token } from '../entity/token.entity';
import { Order } from '../entity/order.entity';
import { Bill } from '../entity/bill.entity';

export interface CheckOrderResponse {
  order: Order;
  bills: Array<Bill>;
}

export interface ICheckOrderService {
  checkOrder(token: Token, protocol: string): Promise<CheckOrderResponse>;
}

export class CheckOrderUseCase {
  private readonly _checkOrderService: ICheckOrderService;
  private readonly _getToken: () => Token;

  constructor(checkOrderService: ICheckOrderService, getToken: () => Token) {
    this._checkOrderService = checkOrderService;
    this._getToken = getToken;
  }

  async checkOrder(protocol: string): Promise<CheckOrderResponse> {
    const token = this._getToken();
    return this._checkOrderService.checkOrder(token, protocol);
  }
}
