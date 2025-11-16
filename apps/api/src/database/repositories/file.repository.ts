import { Injectable } from '@nestjs/common';
import { Prisma } from 'generated/prisma';

import { PrismaService } from '../prisma.service';

@Injectable()
export class FileRepository {
  public constructor(private prisma: PrismaService) {}

  public async findOne(where: Prisma.FileMetadataWhereInput) {
    return this.prisma.fileMetadata.findFirst({
      where,
    });
  }

  public async create(data: Prisma.FileMetadataUncheckedCreateInput) {
    return this.prisma.fileMetadata.create({
      data,
    });
  }

  public async deleteOne(where: Prisma.FileMetadataWhereUniqueInput) {
    return this.prisma.fileMetadata.delete({
      where,
    });
  }
}
