import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { TokenType } from 'generated/prisma';
import { JwtPayload, UserPayload } from 'src/common/types';

import { EmailService } from '../email/email.service';
import { TokenService } from '../token/token.service';
import { UserService } from '../user/user.service';

import { ForgotPasswordDto } from './dtos/forgot-password.dto';
import { ResetPasswordDto } from './dtos/reset-password.dto';

@Injectable()
export class AuthService {
  public constructor(
    private configService: ConfigService,
    private jwtService: JwtService,
    private emailService: EmailService,
    private userService: UserService,
    private tokenService: TokenService,
  ) {}

  private async hashData(data: string) {
    const salt = await bcrypt.genSalt(10);
    const hashedData = await bcrypt.hash(data, salt);
    return hashedData;
  }

  public async login(user: UserPayload) {
    return this.generateTokenPair(user.id);
  }

  private async generateTokenPair(userId: string, tokenId?: string) {
    const accessToken = await this.generateToken({ userId }, 'access');
    const refreshToken = await this.generateToken({ userId }, 'refresh');

    const refreshTokens = await this.tokenService.findMany({
      userId,
      tokenType: TokenType.REFRESH,
    });

    const sessions = this.configService.get<number>('auth.sessions') as number;

    const hashedRefreshToken = await this.hashData(refreshToken);

    if (refreshTokens.length < sessions && !tokenId) {
      await this.tokenService.create({
        tokenType: TokenType.REFRESH,
        token: hashedRefreshToken,
        userId,
      });
    } else {
      await this.tokenService.updateById(
        tokenId || refreshTokens[refreshTokens.length - 1].id,
        {
          tokenType: TokenType.REFRESH,
          token: hashedRefreshToken,
          userId,
          createdAt: new Date(),
        },
      );
    }

    return {
      accessToken,
      refreshToken,
    };
  }

  private async generateToken(
    payload: JwtPayload,
    tokenType: 'access' | 'refresh',
    expiresIn?: number,
  ) {
    return this.jwtService.sign(
      { ...payload },
      {
        expiresIn:
          expiresIn || this.configService.get<string>(`auth.${tokenType}TTL`),
        secret: this.configService.get<string>(`auth.${tokenType}Secret`),
      },
    );
  }

  public async logout(user: UserPayload) {
    if (user.tokenId) {
      return this.tokenService.deleteById(user.tokenId);
    }
    return this.tokenService.deleteMany({
      userId: user.id,
      tokenType: TokenType.REFRESH,
    });
  }

  public async refresh(user: UserPayload) {
    return this.generateTokenPair(user.id, user.tokenId);
  }

  public async requestPasswordReset({ email }: ForgotPasswordDto) {
    const user = await this.userService.findByEmail(email);

    if (!user) {
      throw new NotFoundException('User with such email not found');
    }

    await this.tokenService.deleteMany({
      userId: user.id,
      tokenType: TokenType.PASSWORD,
    });

    const resetPasswordToken = await this.generateToken(
      { userId: user.id },
      'access',
      3600 * 1000,
    );

    const hashedPasswordToken = await this.hashData(resetPasswordToken);

    await this.tokenService.create({
      userId: user.id,
      tokenType: TokenType.PASSWORD,
      token: hashedPasswordToken,
    });

    const fontendUrl = this.configService.get<string>(`frontend`);

    await this.emailService.sendEmail({
      subject: 'Password reset',
      to: email,
      message: `Click here to reset your password: ${fontendUrl}/password/reset?token=${resetPasswordToken}`,
    });
  }

  public async resetPassword(
    userId: string,
    { newPassword, confirmPassword }: ResetPasswordDto,
  ) {
    if (newPassword !== confirmPassword) {
      throw new BadRequestException('Passwords must match');
    }

    const hashedPassword = await this.hashData(newPassword);
    await this.userService.updateById(userId, { password: hashedPassword });

    await this.tokenService.deleteMany({
      userId,
      tokenType: TokenType.PASSWORD,
    });
  }
}
