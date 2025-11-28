import { Injectable } from '@nestjs/common';
import { Prisma } from 'generated/prisma';

import { PrismaService } from '../prisma.service';

@Injectable()
export class ClientRepository {
  public constructor(private prisma: PrismaService) {}

  public async findOne(
    where: Prisma.ClientWhereInput,
    tx?: Prisma.TransactionClient,
  ) {
    return (tx ?? this.prisma).client.findFirst({ where });
  }

  public async findMany(
    where: Prisma.ClientWhereInput,
    take: number = 100,
    skip: number = 0,
    tx?: Prisma.TransactionClient,
  ) {
    return (tx ?? this.prisma).client.findMany({
      where,
      take,
      skip,
    });
  }

  public async count(
    where: Prisma.ClientWhereInput,
    tx?: Prisma.TransactionClient,
  ) {
    return (tx ?? this.prisma).client.count({ where });
  }

  public async create(
    data: Prisma.ClientUncheckedCreateInput,
    tx?: Prisma.TransactionClient,
  ) {
    return (tx ?? this.prisma).client.create({ data });
  }

  public async updateOne(
    where: Prisma.ClientWhereUniqueInput,
    data: Prisma.ClientUncheckedUpdateInput,
    tx?: Prisma.TransactionClient,
  ) {
    return (tx ?? this.prisma).client.update({
      where,
      data: { ...data },
    });
  }

  public async deleteOne(
    where: Prisma.ClientWhereUniqueInput,
    tx?: Prisma.TransactionClient,
  ) {
    return (tx ?? this.prisma).client.delete({
      where,
    });
  }

  public async deleteMany(
    where: Prisma.ClientWhereInput,
    tx?: Prisma.TransactionClient,
  ) {
    return (tx ?? this.prisma).client.deleteMany({ where });
  }
}
