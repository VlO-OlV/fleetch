import { Module } from '@nestjs/common';

import { AuthModule } from './auth/auth.module';
import { TokenModule } from './token/token.module';
import { UserModule } from './user/user.module';
import { EmailModule } from './email/email.module';
import { FileModule } from './file/file.module';

@Module({
  imports: [AuthModule, UserModule, TokenModule, EmailModule, FileModule],
})
export class ApiModule {}
