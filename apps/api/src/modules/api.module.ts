import { Module } from '@nestjs/common';

import { AuthModule } from './auth/auth.module';
import { EmailModule } from './email/email.module';
import { FileModule } from './file/file.module';
import { TokenModule } from './token/token.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [AuthModule, UserModule, TokenModule, EmailModule, FileModule],
})
export class ApiModule {}
