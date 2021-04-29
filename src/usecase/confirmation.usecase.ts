import { Token } from '../entity/token.entity';
import { State } from '../entity/state.entity';
import { Confirmation } from '../entity/confirmation.entity';
import { Debt } from '../entity/debt.entity';

export interface ConfirmationResponse {
  confirmations: Array<Confirmation>;
}

export interface IConfirmationService {
  confirmation(token: Token, protocol: string, state: State, debts: Array<Debt>): Promise<ConfirmationResponse>;
}

export class ConfirmationUseCase {
  private readonly _confirmationService: IConfirmationService;
  private readonly _getToken: () => Token;

  constructor(confirmationService: IConfirmationService, getToken: () => Token) {
    this._confirmationService = confirmationService;
    this._getToken = getToken;
  }

  async confirmation(protocol: string, state: State, debts: Array<Debt>): Promise<ConfirmationResponse> {
    const token = this._getToken();
    return this._confirmationService.confirmation(token, protocol, state, debts);
  }
}
