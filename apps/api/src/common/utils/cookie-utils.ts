import { CookieOptions, Request, Response } from 'express';

export class CookieUtils {
  public static cookieConfig: CookieOptions = {
    path: '/',
    httpOnly: true,
    sameSite: 'strict',
    secure: true,
  };

  public static extractTokenFromCookies = (request: Request) => {
    const cookies = request.cookies;
    return cookies['refreshToken'];
  };

  public static setTokenCookie = (
    res: Response,
    token: string,
    maxAge?: number,
  ) => {
    res.cookie('refreshToken', token, {
      ...CookieUtils.cookieConfig,
      maxAge,
    });
  };
}
