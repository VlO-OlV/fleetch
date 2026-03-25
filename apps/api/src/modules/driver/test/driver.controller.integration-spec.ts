import { Test, TestingModule } from '@nestjs/testing';

import { DriverController } from '../driver.controller';
import { DriverService } from '../driver.service';

describe('DriverController (integration)', () => {
  let controller: DriverController;

  const mockService = {
    findMany: jest
      .fn()
      .mockResolvedValue({ data: [], totalPages: 0, page: 1, limit: 10 }),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DriverController],
      providers: [DriverService],
    })
      .overrideProvider(DriverService)
      .useValue(mockService)
      .compile();

    controller = module.get<DriverController>(DriverController);
  });

  it('getDrivers returns data from service', async () => {
    const res = await controller.getDrivers({});
    expect(res).toHaveProperty('data');
    expect(mockService.findMany).toHaveBeenCalled();
  });
});
