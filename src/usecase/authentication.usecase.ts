import { Token } from '../entity/token.entity';
import { Jwt } from '../lib/jwt.lib';

export interface IAuthenticationService {
  authentication(username: string, password: string): Promise<Token>;
}

export class AuthenticationUseCase {
  private readonly _authenticationService: IAuthenticationService;
  private readonly _username: string;
  private readonly _password: string;
  private _token: Token | null;
  private _timeout: NodeJS.Timeout | null;

  constructor(authenticationService: IAuthenticationService, username: string, password: string) {
    this._authenticationService = authenticationService;
    this._username = username;
    this._password = password;
    this._token = null;
    this._timeout = null;
  }

  getTokenOrThrow(): Token {
    if (this._token === null) throw new Error('No token available!');
    return this._token;
  }

  async authentication(): Promise<void> {
    this._token = await this._authenticationService.authentication(this._username, this._password);
    if (this._token) {
      const decodedToken = Jwt.decode(this._token.token);
      const timeout = Jwt.getNextTokenTimeout(decodedToken);
      this._timeout = setTimeout(() => this.authentication(), timeout);
    }
  }

  async destroy(): Promise<void> {
    if (this._timeout !== null) clearTimeout(this._timeout);
  }
}
