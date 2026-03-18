import { BadRequestException } from '@nestjs/common';

import { RideService } from '../ride.service';

describe('RideService (unit)', () => {
  const mockRideRepo: any = {
    findMany: jest.fn(),
    count: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    updateOne: jest.fn(),
    deleteOne: jest.fn(),
  };
  const mockClient = { count: jest.fn() };
  const mockDriver = {
    count: jest.fn(),
    findById: jest.fn(),
    updateById: jest.fn(),
  };
  const mockUser = { findById: jest.fn() };
  const mockRideClass = { findMany: jest.fn() };
  const mockExtra = { findMany: jest.fn() };
  const mockPrisma = { $transaction: jest.fn() };

  const service = new RideService(
    mockUser as any,
    mockDriver as any,
    mockClient as any,
    mockRideClass as any,
    mockExtra as any,
    mockRideRepo as any,
    mockPrisma as any,
  );

  beforeEach(() => jest.clearAllMocks());

  it('getGeneralStats returns counts', async () => {
    mockRideRepo.count.mockResolvedValue(5);
    mockClient.count.mockResolvedValue(2);
    mockDriver.count.mockResolvedValue(3);

    const res = await service.getGeneralStats();
    expect(res).toEqual({ rideCount: 5, clientCount: 2, driverCount: 3 });
  });

  it('create throws when scheduled in the past', async () => {
    await expect(
      service.create({
        locations: [],
        scheduledAt: new Date(0).toISOString(),
      } as any),
    ).rejects.toBeInstanceOf(BadRequestException);
  });
});
