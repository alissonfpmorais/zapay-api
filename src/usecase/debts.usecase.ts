import { Token } from '../entity/token.entity';
import { State } from '../entity/state.entity';
import { Plate } from '../entity/plate.entity';
import { Renavam } from '../entity/renavam.entity';
import { Debt } from '../entity/debt.entity';
import { CompleteVehicle } from '../entity/vehicle.entity';

export interface DebtsResponse {
  protocol: string;
  debts: Array<Debt>;
  vehicle: CompleteVehicle;
}

export interface AsyncDebtsResponse {
  protocol: string;
  status: 'processing';
}

export interface IDebtsService {
  debts(token: Token, state: State, plate: Plate, renavam: Renavam): Promise<DebtsResponse>;
  asyncDebts(token: Token, state: State, plate: Plate, renavam: Renavam): Promise<AsyncDebtsResponse>;
}

export class DebtsUseCase {
  private readonly _debtsService: IDebtsService;
  private readonly _getToken: () => Token;

  constructor(debtsService: IDebtsService, getToken: () => Token) {
    this._debtsService = debtsService;
    this._getToken = getToken;
  }

  async debts(state: State, plate: Plate, renavam: Renavam): Promise<DebtsResponse> {
    const token = this._getToken();
    return this._debtsService.debts(token, state, plate, renavam);
  }

  async asyncDebts(state: State, plate: Plate, renavam: Renavam): Promise<AsyncDebtsResponse> {
    const token = this._getToken();
    return this._debtsService.asyncDebts(token, state, plate, renavam);
  }
}
