export type Method =
  | 'get'
  | 'GET'
  | 'delete'
  | 'DELETE'
  | 'head'
  | 'HEAD'
  | 'options'
  | 'OPTIONS'
  | 'post'
  | 'POST'
  | 'put'
  | 'PUT'
  | 'patch'
  | 'PATCH'
  | 'purge'
  | 'PURGE'
  | 'link'
  | 'LINK'
  | 'unlink'
  | 'UNLINK';

export interface RequestOptions {
  url: string;
  method: Method;
  headers?: Record<string, unknown>;
  data?: Record<string, unknown>;
}

export interface RequestResponse<Response> {
  data: Response;
  status: number;
  statusText: string;
  headers: Record<string, unknown>;
}

export type HttpClient = <Response>(options: RequestOptions) => Promise<RequestResponse<Response>>;

export interface IRequestBuilder {
  request<Response>(options: RequestOptions): Promise<RequestResponse<Response>>;
}

export class RequestBuilder implements IRequestBuilder {
  private readonly _client: <Response>(options: RequestOptions) => Promise<RequestResponse<Response>>;

  constructor(client: HttpClient) {
    this._client = client;
  }

  async request<Response>(options: RequestOptions): Promise<RequestResponse<Response>> {
    return this._client<Response>(options);
  }
}
