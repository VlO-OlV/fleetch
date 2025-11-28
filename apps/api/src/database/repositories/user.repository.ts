import { Injectable } from '@nestjs/common';
import { Prisma } from 'generated/prisma';

import { PrismaService } from '../prisma.service';

@Injectable()
export class UserRepository {
  public constructor(private prisma: PrismaService) {}

  public async findOne(
    where: Prisma.UserWhereInput,
    tx?: Prisma.TransactionClient,
  ) {
    return (tx ?? this.prisma).user.findFirst({ where });
  }

  public async findMany(
    where: Prisma.UserWhereInput,
    tx?: Prisma.TransactionClient,
  ) {
    return (tx ?? this.prisma).user.findMany({ where });
  }

  public async create(
    data: Prisma.UserUncheckedCreateInput,
    tx?: Prisma.TransactionClient,
  ) {
    return (tx ?? this.prisma).user.create({ data });
  }

  public async updateOne(
    where: Prisma.UserWhereUniqueInput,
    data: Prisma.UserUncheckedUpdateInput,
    tx?: Prisma.TransactionClient,
  ) {
    return (tx ?? this.prisma).user.update({
      where,
      data: { ...data },
    });
  }

  public async deleteOne(
    where: Prisma.UserWhereUniqueInput,
    tx?: Prisma.TransactionClient,
  ) {
    return (tx ?? this.prisma).user.delete({ where });
  }

  public async deleteMany(
    where: Prisma.UserWhereInput,
    tx?: Prisma.TransactionClient,
  ) {
    return (tx ?? this.prisma).user.deleteMany({ where });
  }
}
