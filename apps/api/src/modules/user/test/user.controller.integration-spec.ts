import { Test, TestingModule } from '@nestjs/testing';

import { UserController } from '../user.controller';
import { UserService } from '../user.service';

describe('UserController (integration)', () => {
  let controller: UserController;

  const mockService = {
    findMany: jest
      .fn()
      .mockResolvedValue({ data: [], totalPages: 0, page: 1, limit: 10 }),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService],
    })
      .overrideProvider(UserService)
      .useValue(mockService)
      .compile();

    controller = module.get<UserController>(UserController);
  });

  it('getUsers delegates to service', async () => {
    const res = await controller.getUsers({});
    expect(res).toHaveProperty('data');
    expect(mockService.findMany).toHaveBeenCalled();
  });
});
