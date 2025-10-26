import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import * as bcrypt from 'bcrypt';
import { Request } from 'express';
import { TokenType } from 'generated/prisma';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserPayload } from 'src/common/decorators/current-user.decorator';
import { CookieUtils } from 'src/common/utils/cookie-utils';
import { TokenRepository } from 'src/database/repositories/token.repository';

import { JwtStrategy } from '../jwt/jwt.strategy';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    private tokenRepository: TokenRepository,
    private jwtStrategy: JwtStrategy,
    configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => CookieUtils.extractTokenFromCookies(request),
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get('auth.refreshSecret') as string,
      passReqToCallback: true,
    });
  }

  async validate(
    request: Request,
    payload: { sub: string },
  ): Promise<UserPayload> {
    const userPayload = await this.jwtStrategy.validate(payload);
    const refreshToken = await CookieUtils.extractTokenFromCookies(request);

    const userTokens = await this.tokenRepository.findMany({
      userId: userPayload.id,
      tokenType: TokenType.REFRESH,
    });

    const matches = await Promise.all(
      userTokens.map(
        async ({ token }) => await bcrypt.compare(refreshToken, token),
      ),
    );
    const matchIndex = matches.indexOf(true);

    if (matchIndex < 0) {
      throw new UnauthorizedException('Refresh token expired');
    }

    return {
      ...userPayload,
      tokenId: userTokens[matchIndex].id,
    };
  }
}
