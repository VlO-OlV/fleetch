import { Module } from '@nestjs/common';

import { AuthModule } from './auth/auth.module';
import { ClientModule } from './client/client.module';
import { DriverModule } from './driver/driver.module';
import { EmailModule } from './email/email.module';
import { ExtraOptionModule } from './extra-option/extra-option.module';
import { FileModule } from './file/file.module';
import { RideModule } from './ride/ride.module';
import { RideClassModule } from './ride-class/ride-class.module';
import { TokenModule } from './token/token.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    TokenModule,
    EmailModule,
    FileModule,
    ClientModule,
    DriverModule,
    RideModule,
    RideClassModule,
    ExtraOptionModule,
  ],
})
export class ApiModule {}
