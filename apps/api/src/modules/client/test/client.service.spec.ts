import { NotFoundException } from '@nestjs/common';

import { ClientService } from '../client.service';

describe('ClientService (unit)', () => {
  const mockRepo: any = {
    findMany: jest.fn(),
    count: jest.fn(),
    findOne: jest.fn(),
  };

  const service = new ClientService(mockRepo);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('findMany maps totalRides and pagination', async () => {
    mockRepo.findMany.mockResolvedValue([
      { id: '1', _count: { rides: 2 }, firstName: 'A' },
    ]);
    mockRepo.count.mockResolvedValue(1);

    const res = await service.findMany({});

    expect(res.data[0].totalRides).toBe(2);
    expect(res.totalItems).toBe(1);
    expect(res.page).toBe(1);
  });

  it('findById throws when not found', async () => {
    mockRepo.findOne.mockResolvedValue(null);

    await expect(service.findById('nope')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
