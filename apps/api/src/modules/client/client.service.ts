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
    const { page = 1, limit = 10, firstName, lastName, phoneNumber } = query;

    const where: Prisma.ClientWhereInput = {};
    if (firstName) {
      where.firstName = { contains: firstName, mode: 'insensitive' };
    }
    if (lastName) {
      where.lastName = { contains: lastName, mode: 'insensitive' };
    }
    if (phoneNumber) {
      where.phoneNumber = { contains: phoneNumber };
    }

    const clients = await this.clientRepository.findMany(
      where,
      limit,
      (page - 1) * limit,
    );
    const totalClients = await this.clientRepository.count(where);

    return {
      data: [...clients],
      total: totalClients,
      page,
      limit,
    };
  }

  public async findById(id: string) {
    const client = await this.clientRepository.findOne({ id });

    if (!client) {
      throw new NotFoundException('Client with such id not found');
    }

    return client;
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
