import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { TokenType } from 'generated/prisma';
import {
  JwtPayload,
  UserPayload,
} from 'src/common/decorators/current-user.decorator';
import { TokenRepository } from 'src/database/repositories/token.repository';

@Injectable()
export class AuthService {
  public constructor(
    private tokenRepository: TokenRepository,
    private configService: ConfigService,
    private jwtService: JwtService,
  ) {}

  public async login(user: UserPayload) {
    return this.generateTokenPair(user.id);
  }

  private async generateTokenPair(userId: string, tokenId?: string) {
    const accessToken = await this.generateToken({ sub: userId }, 'access');
    const refreshToken = await this.generateToken({ sub: userId }, 'refresh');

    const refreshTokens = await this.tokenRepository.findMany({
      userId,
      tokenType: TokenType.REFRESH,
    });

    const sessions = this.configService.get<number>('auth.sessions') as number;

    const salt = await bcrypt.genSalt(10);
    const hashedRefreshToken = await bcrypt.hash(refreshToken, salt);

    if (refreshTokens.length < sessions && !tokenId) {
      await this.tokenRepository.create({
        tokenType: TokenType.REFRESH,
        token: hashedRefreshToken,
        userId,
      });
    } else {
      await this.tokenRepository.updateById(
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
  ) {
    return this.jwtService.sign(
      { ...payload },
      {
        expiresIn: this.configService.get<string>(`auth.${tokenType}TTL`),
        secret: this.configService.get<string>(`auth.${tokenType}Secret`),
      },
    );
  }

  public async logout(user: UserPayload) {
    if (user.tokenId) {
      return this.tokenRepository.deleteById(user.tokenId);
    }
    return this.tokenRepository.deleteMany({
      userId: user.id,
      tokenType: TokenType.REFRESH,
    });
  }

  public async refresh(user: UserPayload) {
    return this.generateTokenPair(user.id, user.tokenId);
  }
}
