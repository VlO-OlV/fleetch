import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { EmailModule } from '../email/email.module';
import { TokenModule } from '../token/token.module';
import { UserModule } from '../user/user.module';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [EmailModule, UserModule, TokenModule],
  controllers: [AuthController],
  providers: [AuthService, JwtService],
  exports: [AuthService],
})
export class AuthModule {}
