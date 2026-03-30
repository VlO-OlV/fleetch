import { Injectable } from '@nestjs/common';
import { Prisma } from 'generated/prisma';

import { PrismaService } from '../prisma.service';

import { AbstractRepository } from './abstract.repository';

@Injectable()
export class FileRepository extends AbstractRepository<
  'fileMetadata',
  Prisma.FileMetadataGetPayload<{}>
> {
  constructor(prisma: PrismaService) {
    super(prisma.fileMetadata, 'fileMetadata');
  }
}
