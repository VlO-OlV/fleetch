import { Injectable } from '@nestjs/common';
import { Prisma } from 'generated/prisma';

import { PrismaService } from '../prisma.service';

@Injectable()
export class TokenRepository {
  public constructor(private prisma: PrismaService) {}

  private orderBy: Prisma.TokenOrderByWithRelationInput = {
    createdAt: 'desc',
  };

  public async findOne(where: Prisma.TokenWhereInput) {
    return this.prisma.token.findFirst({ where });
  }

  public async findMany(where: Prisma.TokenWhereInput) {
    return this.prisma.token.findMany({
      where,
      orderBy: this.orderBy,
    });
  }

  public async create(data: Prisma.TokenUncheckedCreateInput) {
    return this.prisma.token.create({ data });
  }

  public async updateById(id: string, data: Prisma.TokenUncheckedUpdateInput) {
    return this.prisma.token.update({
      where: { id },
      data: { ...data },
    });
  }

  public async deleteById(id: string) {
    return this.prisma.token.delete({
      where: { id },
    });
  }

  public async deleteMany(where: Prisma.TokenWhereInput) {
    return (this, this.prisma.token.deleteMany({ where }));
  }
}
