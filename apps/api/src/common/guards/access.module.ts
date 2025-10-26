import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { JwtStrategy } from './jwt/jwt.strategy';
import { JwtRefreshStrategy } from './jwt-refresh/jwt-refresh.strategy';
import { LocalStrategy } from './local/local.strategy';

@Module({
  imports: [PassportModule, JwtModule.register({})],
  providers: [LocalStrategy, JwtStrategy, JwtRefreshStrategy],
})
export class AccessModule {}
