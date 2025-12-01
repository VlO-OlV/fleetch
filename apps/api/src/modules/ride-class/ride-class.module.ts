import { Module } from '@nestjs/common';

import { RideClassController } from './ride-class.controller';
import { RideClassService } from './ride-class.service';

@Module({
  controllers: [RideClassController],
  providers: [RideClassService],
  exports: [RideClassService],
})
export class RideClassModule {}
