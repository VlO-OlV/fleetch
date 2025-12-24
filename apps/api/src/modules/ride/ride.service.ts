import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PaymentType, Prisma, RideStatus } from 'generated/prisma';
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
      rideClassId,
      search,
      sortBy,
      sortOrder = 'asc',
    } = query;

    const where: Prisma.RideWhereInput = {};
    if (status) {
      where.status = status;
    }
    if (paymentType) {
      where.paymentType = paymentType;
    }
    if (rideClassId) {
      where.rideClassId = rideClassId;
    }
    if (search) {
      where.OR = [
        {
          client: {
            OR: [
              { firstName: { contains: search, mode: 'insensitive' } },
              { middleName: { contains: search, mode: 'insensitive' } },
              { lastName: { contains: search, mode: 'insensitive' } },
            ],
          },
        },
        {
          driver: {
            OR: [
              { firstName: { contains: search, mode: 'insensitive' } },
              { middleName: { contains: search, mode: 'insensitive' } },
              { lastName: { contains: search, mode: 'insensitive' } },
            ],
          },
        },
        {
          operator: {
            OR: [
              { firstName: { contains: search, mode: 'insensitive' } },
              { middleName: { contains: search, mode: 'insensitive' } },
              { lastName: { contains: search, mode: 'insensitive' } },
            ],
          },
        },
      ];
    }

    const orderBy: Prisma.RideOrderByWithRelationInput = {};
    if (sortBy === 'clientId') {
      orderBy.client = { firstName: sortOrder };
    } else if (sortBy === 'operatorId') {
      orderBy.operator = { firstName: sortOrder };
    } else if (sortBy === 'driverId') {
      orderBy.driver = { firstName: sortOrder };
    } else if (sortBy === 'rideClassId') {
      orderBy.rideClass = { name: sortOrder };
    } else if (sortBy) {
      orderBy[sortBy] = sortOrder;
    }

    const rides = await this.rideRepository.findMany(
      where,
      limit,
      (page - 1) * limit,
      orderBy,
    );
    const totalRides = await this.rideRepository.count(where);

    return {
      data: [...rides],
      totalPages: Math.ceil(totalRides / limit),
      page,
      limit,
    };
  }

  public async findById(id: string) {
    const ride = await this.rideRepository.findOne({ id });

    if (!ride) {
      throw new NotFoundException('Ride with such id not found');
    }

    return {
      ...ride,
      rideExtraOptions: ride.rideExtraOptions.map(
        (option) => option.extraOption,
      ),
    };
  }

  public async count(where: Prisma.RideWhereInput) {
    return this.rideRepository.count({ ...where });
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

    if (data.scheduledAt && new Date(data.scheduledAt).getTime() < Date.now()) {
      throw new BadRequestException('Ride cannot be scheduled in the past');
    }

    return this.prisma.$transaction(async (tx) => {
      const ride = await this.rideRepository.create(
        {
          ...data,
          status: data.driverId
            ? data.scheduledAt
              ? RideStatus.UPCOMING
              : RideStatus.IN_PROGRESS
            : RideStatus.PENDING,
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

    const ride = await this.findById(id);

    if (
      ride.status === RideStatus.COMPLETED ||
      ride.status === RideStatus.CANCELLED
    ) {
      throw new BadRequestException(
        'Cannot update completed or cancelled rides',
      );
    }

    await this.validateRelations({ ...dto });

    if (data.status === RideStatus.COMPLETED && data.driverId) {
      const driver = await this.driverService.findById(data.driverId);
      await this.driverService.updateById(data.driverId, {
        totalRides: driver.totalRides + 1,
      });
    }

    return this.prisma.$transaction(async (tx) => {
      const ride = await this.rideRepository.updateOne(
        {
          id,
        },
        {
          ...data,
          status:
            data.status ||
            (data.driverId
              ? data.scheduledAt
                ? RideStatus.UPCOMING
                : RideStatus.IN_PROGRESS
              : RideStatus.PENDING),
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

  public async getGeneralStats() {
    const rideCount = await this.count({});
    const clientCount = await this.clientService.count();
    const driverCount = await this.driverService.count();

    return {
      rideCount,
      clientCount,
      driverCount,
    };
  }

  public async getRidesByPaymentTypeStats() {
    const cashCount = await this.count({ paymentType: PaymentType.CASH });
    const cardCount = await this.count({ paymentType: PaymentType.CARD });
    const cryptoCount = await this.count({ paymentType: PaymentType.CRYPTO });

    return {
      cashCount,
      cardCount,
      cryptoCount,
    };
  }

  public async getIncomeByRideClassStats() {
    const incomes = await this.prisma.ride.groupBy({
      by: ['rideClassId'],
      _sum: {
        totalPrice: true,
      },
    });

    const rideClasses = await this.rideClassService.findMany();

    return incomes.map((income) => ({
      totalIncome: income._sum.totalPrice,
      rideClass: rideClasses.data.find((rc) => rc.id === income.rideClassId)
        ?.name,
    }));
  }
}
