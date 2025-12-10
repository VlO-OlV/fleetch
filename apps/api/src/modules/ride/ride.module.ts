import { Module } from '@nestjs/common';

import { ClientModule } from '../client/client.module';
import { DriverModule } from '../driver/driver.module';
import { ExtraOptionModule } from '../extra-option/extra-option.module';
import { RideClassModule } from '../ride-class/ride-class.module';
import { UserModule } from '../user/user.module';

import { RideController } from './ride.controller';
import { RideService } from './ride.service';

@Module({
  imports: [
    UserModule,
    DriverModule,
    RideClassModule,
    ExtraOptionModule,
    ClientModule,
  ],
  controllers: [RideController],
  providers: [RideService],
  exports: [RideService],
})
export class RideModule {}
