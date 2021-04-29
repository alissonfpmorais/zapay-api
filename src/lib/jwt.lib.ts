import jwt_decode from 'jwt-decode';

export type DecodedToken = {
  [key: string]: unknown;
  exp: number;
  iat: number;
};

export class Jwt {
  private static readonly THRESHOLD_TIME = 60 * 1000;

  private static currentTimeSinceEpoch(): number {
    return Math.floor(+new Date());
  }

  private static getExpirationTime(decodedToken: DecodedToken): number {
    return decodedToken.exp * 1000;
  }

  static decode(maybeToken: string): DecodedToken | null {
    return maybeToken ? (jwt_decode(maybeToken) as DecodedToken) : null;
  }

  static getNextTokenTimeout(decodedToken: DecodedToken | null): number {
    if (!decodedToken) return 1;
    const expirationTime = this.getExpirationTime(decodedToken);
    const nextTokenTimeout = expirationTime - this.currentTimeSinceEpoch() - this.THRESHOLD_TIME;
    return nextTokenTimeout > 0 ? nextTokenTimeout : 1;
  }
}
