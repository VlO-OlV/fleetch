import { Test, TestingModule } from '@nestjs/testing';

import { ClientController } from '../client.controller';
import { ClientService } from '../client.service';

describe('ClientController (integration)', () => {
  let controller: ClientController;

  const mockService = {
    findMany: jest
      .fn()
      .mockResolvedValue({ data: [], totalItems: 0, page: 1, limit: 10 }),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClientController],
      providers: [ClientService],
    })
      .overrideProvider(ClientService)
      .useValue(mockService)
      .compile();

    controller = module.get<ClientController>(ClientController);
  });

  it('getClients returns data from service', async () => {
    const res = await controller.getClients({});
    expect(res).toHaveProperty('data');
    expect(mockService.findMany).toHaveBeenCalled();
  });
});
