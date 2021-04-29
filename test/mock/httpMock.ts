import * as debts from './debts.json';
import { RequestOptions, RequestResponse } from '../../src/lib/requestBuilder.lib';

function toRequestResponse<Response>(data: Response): RequestResponse<Response> {
  return {
    data: data,
    status: 200,
    statusText: 'Ok',
    headers: {},
  };
}

export async function httpMock<Response>(options: RequestOptions): Promise<RequestResponse<Response>> {
  if (options.method === 'POST' || options.method === 'post') {
    if (options.url === 'https://api.sandbox.usezapay.com.br/zapi/debts/')
      return toRequestResponse<Response>((debts as unknown) as Response);
  }

  return toRequestResponse<Response>(({} as unknown) as Response);
}
