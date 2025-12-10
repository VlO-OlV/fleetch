import { Module } from '@nestjs/common';

import { EmailModule } from '../email/email.module';
import { FileModule } from '../file/file.module';

import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [FileModule, EmailModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
