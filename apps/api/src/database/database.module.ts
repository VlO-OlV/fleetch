import { Global, Module } from '@nestjs/common';

import { PrismaService } from './prisma.service';
import { ClientRepository } from './repositories/client.repository';
import { DriverRepository } from './repositories/driver.repository';
import { ExtraOptionRepository } from './repositories/extra-option.repository';
import { FileRepository } from './repositories/file.repository';
import { RideClassRepository } from './repositories/ride-class.repository';
import { RideRepository } from './repositories/ride.repository';
import { TokenRepository } from './repositories/token.repository';
import { UserRepository } from './repositories/user.repository';

@Global()
@Module({
  providers: [
    PrismaService,
    UserRepository,
    TokenRepository,
    FileRepository,
    DriverRepository,
    RideRepository,
    RideClassRepository,
    ExtraOptionRepository,
    ClientRepository,
  ],
  exports: [
    PrismaService,
    UserRepository,
    TokenRepository,
    FileRepository,
    DriverRepository,
    RideRepository,
    RideClassRepository,
    ExtraOptionRepository,
    ClientRepository,
  ],
})
export class DatabaseModule {}
