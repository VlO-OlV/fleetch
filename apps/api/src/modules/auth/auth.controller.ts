import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Throttle } from '@nestjs/throttler';
import { Response } from 'express';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { GoogleAuthGuard } from 'src/common/guards/google/google-auth.guard';
import { JwtGuard } from 'src/common/guards/jwt/jwt.guard';
import { JwtRefreshGuard } from 'src/common/guards/jwt-refresh/jwt-refresh.guard';
import { LocalGuard } from 'src/common/guards/local/local.guard';
import { UserPayload } from 'src/common/types';
import { CookieUtils } from 'src/common/utils/cookie-utils';

import { AuthService } from './auth.service';
import { ForgotPasswordDto } from './dtos/forgot-password.dto';
import { ResetPasswordDto } from './dtos/reset-password.dto';
import { VerifyCodeDto } from './dtos/verify-code.dto';

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

  @UseGuards(GoogleAuthGuard)
  @Get('google/callback')
  public async googleAuthCallback(
    @Res({ passthrough: true }) res: Response,
    @CurrentUser() user: UserPayload,
  ) {
    if (user.id) {
      const tokens = await this.authService.login(user);

      CookieUtils.setTokenCookie(
        res,
        tokens.refreshToken,
        this.configService.get<number>('auth.refreshTTL'),
      );
    }

    res.redirect(
      (this.configService.get<string>('frontend') as string) +
        `?googleAuth=${user.id ? 'success' : 'failed'}`,
    );
  }

  @Throttle({ default: { ttl: 60000, limit: 1 } })
  @Post('/password/forgot')
  public async forgotPassword(@Body() body: ForgotPasswordDto) {
    return this.authService.requestPasswordReset({ ...body });
  }

  @Post('/password/verify-reset')
  public async verifyResetPassword(@Body() body: VerifyCodeDto) {
    return this.authService.verifyResetCode(body);
  }

  @UseGuards(JwtGuard)
  @Post('/password/reset')
  public async resetPassword(
    @Body() body: ResetPasswordDto,
    @CurrentUser() user: UserPayload,
  ) {
    return this.authService.resetPassword(user.id, body);
  }
}
