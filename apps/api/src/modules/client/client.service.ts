import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from 'generated/prisma';

import { ClientRepository } from '../../database/repositories/client.repository';

import { ClientQueryDto } from './dtos/client-query.dto';
import { CreateClientDto } from './dtos/create-client.dto';
import { UpdateClientDto } from './dtos/update-client.dto';

@Injectable()
export class ClientService {
  public constructor(private readonly clientRepository: ClientRepository) {}

  public async findMany(query: ClientQueryDto) {
    const { page = 1, limit = 10, sortBy, sortOrder = 'asc', search } = query;

    const where: Prisma.ClientWhereInput = {};
    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { middleName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { phoneNumber: { contains: search, mode: 'insensitive' } },
      ];
    }

    const clients = await this.clientRepository.findMany(
      where,
      limit,
      (page - 1) * limit,
      sortBy
        ? {
            ...(sortBy === 'totalRides'
              ? { rides: { _count: sortOrder } }
              : { [sortBy]: sortOrder }),
          }
        : undefined,
    );
    const totalClients = await this.clientRepository.count(where);

    return {
      data: [
        ...clients.map((client) => ({
          ...client,
          totalRides: client._count.rides,
        })),
      ],
      totalItems: totalClients,
      totalPages: Math.ceil(totalClients / limit),
      page,
      limit,
    };
  }

  public async findById(id: string) {
    const client = await this.clientRepository.findOne({ id });

    if (!client) {
      throw new NotFoundException('Client with such id not found');
    }

    return { ...client, totalRides: client._count.rides };
  }

  public async count() {
    return this.clientRepository.count({});
  }

  public async create(dto: CreateClientDto) {
    return this.clientRepository.create({ ...dto });
  }

  public async updateById(id: string, dto: UpdateClientDto) {
    return this.clientRepository.updateOne({ id }, { ...dto });
  }

  public async deleteById(id: string) {
    return this.clientRepository.deleteOne({ id });
  }
}
