import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserPayload } from 'src/common/decorators/current-user.decorator';
import { UserRepository } from 'src/database/repositories/user.repository';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  public constructor(
    private userRepository: UserRepository,
    configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('auth.accessSecret') as string,
    });
  }

  async validate(payload: { sub: string }): Promise<UserPayload> {
    if (!payload) {
      throw new UnauthorizedException();
    }

    const user = await this.userRepository.findOne({ id: payload.sub });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    const userPayload = { ...user, password: undefined };
    return userPayload;
  }
}
