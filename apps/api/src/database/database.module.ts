import { Global, Module } from '@nestjs/common';

import { PrismaService } from './prisma.service';
import { TokenRepository } from './repositories/token.repository';
import { UserRepository } from './repositories/user.repository';

@Global()
@Module({
  providers: [PrismaService, UserRepository, TokenRepository],
  exports: [PrismaService, UserRepository, TokenRepository],
})
export class DatabaseModule {}
