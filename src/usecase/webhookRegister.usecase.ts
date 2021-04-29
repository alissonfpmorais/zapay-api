import { Token } from '../entity/token.entity';
import { Url } from '../entity/url.entity';
import { WebhookReport } from '../entity/webhook.entity';

export interface WebhookRegisterResponse {
  success: boolean;
}

export interface WebhookReportResponse {
  webhookReport: WebhookReport;
}

export interface IWebhookRegisterService {
  webhookRegister(token: Token, url: Url): Promise<WebhookRegisterResponse>;
}

export class WebhookRegisterUseCase {
  private readonly _webhookRegisterService: IWebhookRegisterService;
  private readonly _getToken: () => Token;

  constructor(webhookRegisterService: IWebhookRegisterService, getToken: () => Token) {
    this._webhookRegisterService = webhookRegisterService;
    this._getToken = getToken;
  }

  async webhookRegister(url: Url): Promise<WebhookRegisterResponse> {
    const token = this._getToken();
    return this._webhookRegisterService.webhookRegister(token, url);
  }

  async webhookReport(webhookReport: WebhookReport): Promise<WebhookReportResponse> {
    return { webhookReport };
  }
}
