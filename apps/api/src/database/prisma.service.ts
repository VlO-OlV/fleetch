import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { PrismaClient, Role, State } from 'generated/prisma';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  public constructor(private configService: ConfigService) {
    super();
  }

  public async onModuleInit() {
    await this.$connect();

    const adminEmail = this.configService.get<string>('adminEmail') as string;
    const adminPassword = this.configService.get<string>(
      'adminPassword',
    ) as string;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminPassword, salt);
    await this.user.upsert({
      where: {
        email: adminEmail,
      },
      update: {
        email: adminEmail,
        password: hashedPassword,
      },
      create: {
        email: adminEmail,
        password: hashedPassword,
        firstName: 'Admin',
        lastName: 'Admin',
        role: Role.ADMIN,
        state: State.VERIFIED,
      },
    });
  }
}
