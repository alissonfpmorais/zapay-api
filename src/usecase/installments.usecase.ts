import { InstallmentPlan } from '../entity/installmentPlan.entity';
import { Token } from '../entity/token.entity';
import { Debt } from '../entity/debt.entity';

export interface InstallmentsResponse {
  installmentsPlans: Array<InstallmentPlan>;
}

export interface IInstallmentsService {
  installments(token: Token, protocol: string, debts: Array<Debt>, coupon?: string): Promise<InstallmentsResponse>;
}

export class InstallmentsUseCase {
  private readonly _installmentsService: IInstallmentsService;
  private readonly _getToken: () => Token;

  constructor(installmentsService: IInstallmentsService, getToken: () => Token) {
    this._installmentsService = installmentsService;
    this._getToken = getToken;
  }

  async installments(protocol: string, debts: Array<Debt>, coupon?: string): Promise<InstallmentsResponse> {
    const token = this._getToken();
    return this._installmentsService.installments(token, protocol, debts, coupon);
  }
}
