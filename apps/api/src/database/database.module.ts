import { Global, Module } from '@nestjs/common';

import { PrismaService } from './prisma.service';
import { TokenRepository } from './repositories/token.repository';
import { UserRepository } from './repositories/user.repository';
import { FileRepository } from './repositories/file.repository';

@Global()
@Module({
  providers: [PrismaService, UserRepository, TokenRepository, FileRepository],
  exports: [PrismaService, UserRepository, TokenRepository, FileRepository],
})
export class DatabaseModule {}
