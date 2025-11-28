import { Module } from '@nestjs/common';

import { ExtraOptionController } from './extra-option.controller';
import { ExtraOptionService } from './extra-option.service';

@Module({
  controllers: [ExtraOptionController],
  providers: [ExtraOptionService],
  exports: [ExtraOptionService],
})
export class ExtraOptionModule {}
