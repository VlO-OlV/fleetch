import { Test, TestingModule } from '@nestjs/testing';

import { RideController } from '../ride.controller';
import { RideService } from '../ride.service';

describe('RideController (integration)', () => {
  let controller: RideController;

  const mockService = {
    getGeneralStats: jest.fn().mockResolvedValue({}),
    findMany: jest
      .fn()
      .mockResolvedValue({ data: [], totalPages: 0, page: 1, limit: 10 }),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RideController],
      providers: [RideService],
    })
      .overrideProvider(RideService)
      .useValue(mockService)
      .compile();

    controller = module.get<RideController>(RideController);
  });

  it('getGeneralStats delegates to service', async () => {
    const res = await controller.getGeneralStats();
    expect(mockService.getGeneralStats).toHaveBeenCalled();
    expect(res).toEqual({});
  });
});
