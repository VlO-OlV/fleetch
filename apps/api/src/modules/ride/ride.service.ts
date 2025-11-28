import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from 'generated/prisma';
import { PrismaService } from 'src/database/prisma.service';

import { RideRepository } from '../../database/repositories/ride.repository';
import { ClientService } from '../client/client.service';
import { DriverService } from '../driver/driver.service';
import { ExtraOptionService } from '../extra-option/extra-option.service';
import { RideClassService } from '../ride-class/ride-class.service';
import { UserService } from '../user/user.service';

import { CreateRideDto } from './dtos/create-ride.dto';
import { RideQueryDto } from './dtos/ride-query.dto';
import { UpdateRideDto } from './dtos/update-ride.dto';

@Injectable()
export class RideService {
  public constructor(
    private readonly userService: UserService,
    private readonly driverService: DriverService,
    private readonly clientService: ClientService,
    private readonly rideClassService: RideClassService,
    private readonly extraOptionService: ExtraOptionService,
    private readonly rideRepository: RideRepository,
    private readonly prisma: PrismaService,
  ) {}

  public async findMany(query: RideQueryDto) {
    const {
      page = 1,
      limit = 10,
      status,
      paymentType,
      clientId,
      driverId,
    } = query;

    const where: Prisma.RideWhereInput = {};
    if (status) {
      where.status = status;
    }
    if (paymentType) {
      where.paymentType = paymentType;
    }
    if (clientId) {
      where.clientId = clientId;
    }
    if (driverId) {
      where.driverId = driverId;
    }

    const rides = await this.rideRepository.findMany(
      where,
      limit,
      (page - 1) * limit,
    );
    const totalRides = await this.rideRepository.count(where);

    return {
      data: [...rides],
      total: totalRides,
      page,
      limit,
    };
  }

  public async findById(id: string) {
    const ride = await this.rideRepository.findOne({ id });

    if (!ride) {
      throw new NotFoundException('Ride with such id not found');
    }

    return ride;
  }

  private async validateRelations(
    data: Pick<
      UpdateRideDto,
      'clientId' | 'driverId' | 'rideClassId' | 'operatorId'
    >,
  ) {
    const { clientId, driverId, rideClassId, operatorId } = data;

    if (clientId) {
      await this.clientService.findById(clientId);
    }
    if (driverId) {
      await this.driverService.findById(driverId);
    }
    if (rideClassId) {
      await this.rideClassService.findById(rideClassId);
    }
    if (operatorId) {
      await this.userService.findById(operatorId);
    }
  }

  private async updateRideExtraOptions(
    id: string,
    extraOptionIds: string[],
    tx?: Prisma.TransactionClient,
  ) {
    const extraOptions = await this.extraOptionService.findMany(
      {
        id: {
          in: [...extraOptionIds],
        },
      },
      tx,
    );

    await this.rideRepository.updateOne(
      { id },
      {
        rideExtraOptions: {
          deleteMany: {},
          create: extraOptions.data.map((option) => ({
            extraOptionId: option.id,
          })),
        },
      },
      tx,
    );
  }

  public async create(dto: CreateRideDto) {
    const { locations, rideExtraOptionIds, ...data } = dto;

    await this.validateRelations({ ...dto });

    return this.prisma.$transaction(async (tx) => {
      const ride = await this.rideRepository.create(
        {
          ...data,
          locations: {
            create: [...locations],
          },
        },
        tx,
      );

      if (rideExtraOptionIds) {
        await this.updateRideExtraOptions(ride.id, rideExtraOptionIds, tx);
      }

      return ride;
    });
  }

  public async updateById(id: string, dto: UpdateRideDto) {
    const { locations, rideExtraOptionIds, ...data } = dto;

    await this.validateRelations({ ...dto });

    return this.prisma.$transaction(async (tx) => {
      const ride = await this.rideRepository.updateOne(
        {
          id,
        },
        {
          ...data,
          ...(locations
            ? {
                locations: {
                  deleteMany: {},
                  create: [...locations],
                },
              }
            : {}),
        },
        tx,
      );

      if (rideExtraOptionIds) {
        await this.updateRideExtraOptions(ride.id, rideExtraOptionIds, tx);
      }

      return ride;
    });
  }

  public async deleteById(id: string) {
    return this.rideRepository.deleteOne({ id });
  }
}
