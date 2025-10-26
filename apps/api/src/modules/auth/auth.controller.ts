import { Controller, Post, Res, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import {
  CurrentUser,
  UserPayload,
} from 'src/common/decorators/current-user.decorator';
import { JwtGuard } from 'src/common/guards/jwt/jwt.guard';
import { JwtRefreshGuard } from 'src/common/guards/jwt-refresh/jwt-refresh.guard';
import { LocalGuard } from 'src/common/guards/local/local.guard';
import { CookieUtils } from 'src/common/utils/cookie-utils';

import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  public constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @UseGuards(LocalGuard)
  @Post('login')
  public async login(
    @Res({ passthrough: true }) res: Response,
    @CurrentUser() user: UserPayload,
  ) {
    const tokens = await this.authService.login(user);

    CookieUtils.setTokenCookie(
      res,
      tokens.refreshToken,
      this.configService.get<number>('auth.refreshTTL'),
    );

    return {
      accessToken: tokens.accessToken,
    };
  }

  @UseGuards(JwtRefreshGuard)
  @Post('logout')
  public async logout(
    @Res({ passthrough: true }) res: Response,
    @CurrentUser() user: UserPayload,
  ) {
    await this.authService.logout(user);

    res.clearCookie('refreshToken');
  }

  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  public async refreshToken(
    @Res({ passthrough: true }) res: Response,
    @CurrentUser() user: UserPayload,
  ) {
    const tokens = await this.authService.refresh(user);

    CookieUtils.setTokenCookie(
      res,
      tokens.refreshToken,
      this.configService.get<number>('auth.refreshTTL'),
    );

    return {
      accessToken: tokens.accessToken,
    };
  }

  @UseGuards(JwtGuard)
  @Post('clear-sessions')
  public clearSessions(
    @Res({ passthrough: true }) res: Response,
    @CurrentUser() user: UserPayload,
  ) {
    const userWithoutToken = { ...user, tokenId: undefined };

    res.clearCookie('refreshToken');

    return this.authService.logout(userWithoutToken);
  }
}
