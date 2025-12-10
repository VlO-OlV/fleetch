import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TokenModule } from 'src/modules/token/token.module';
import { UserModule } from 'src/modules/user/user.module';

import { GoogleAuthStrategy } from './google/google-auth.strategy';
import { JwtStrategy } from './jwt/jwt.strategy';
import { JwtRefreshStrategy } from './jwt-refresh/jwt-refresh.strategy';
import { LocalStrategy } from './local/local.strategy';

@Module({
  imports: [PassportModule, JwtModule.register({}), UserModule, TokenModule],
  providers: [
    LocalStrategy,
    JwtStrategy,
    JwtRefreshStrategy,
    GoogleAuthStrategy,
  ],
})
export class AccessModule {}
