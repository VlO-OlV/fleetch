import { Injectable } from '@nestjs/common';
import { Prisma } from 'generated/prisma';

import { PrismaService } from '../prisma.service';

@Injectable()
export class UserRepository {
  public constructor(private prisma: PrismaService) {}

  public async findOne(where: Prisma.UserWhereInput) {
    return this.prisma.user.findFirst({ where });
  }
}
