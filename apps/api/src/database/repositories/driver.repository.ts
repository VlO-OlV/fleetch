import { Injectable } from '@nestjs/common';
import { Prisma } from 'generated/prisma';

import { PrismaService } from '../prisma.service';

@Injectable()
export class DriverRepository {
  public constructor(private prisma: PrismaService) {}

  public async findOne(
    where: Prisma.DriverWhereInput,
    tx?: Prisma.TransactionClient,
  ) {
    return (tx ?? this.prisma).driver.findFirst({ where });
  }

  public async findMany(
    where: Prisma.DriverWhereInput,
    take: number = 100,
    skip: number = 0,
    tx?: Prisma.TransactionClient,
  ) {
    return (tx ?? this.prisma).driver.findMany({ where, take, skip });
  }

  public async count(
    where: Prisma.DriverWhereInput,
    tx?: Prisma.TransactionClient,
  ) {
    return (tx ?? this.prisma).driver.count({ where });
  }

  public async create(
    data: Prisma.DriverUncheckedCreateInput,
    tx?: Prisma.TransactionClient,
  ) {
    return (tx ?? this.prisma).driver.create({ data });
  }

  public async updateOne(
    where: Prisma.DriverWhereUniqueInput,
    data: Prisma.DriverUncheckedUpdateInput,
    tx?: Prisma.TransactionClient,
  ) {
    return (tx ?? this.prisma).driver.update({
      where,
      data: { ...data },
    });
  }

  public async deleteOne(
    where: Prisma.DriverWhereUniqueInput,
    tx?: Prisma.TransactionClient,
  ) {
    return (tx ?? this.prisma).driver.delete({ where });
  }

  public async deleteMany(
    where: Prisma.DriverWhereInput,
    tx?: Prisma.TransactionClient,
  ) {
    return (tx ?? this.prisma).driver.deleteMany({ where });
  }
}
