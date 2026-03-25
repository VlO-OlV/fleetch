import { NotFoundException } from '@nestjs/common';

import { DriverService } from '../driver.service';

describe('DriverService (unit)', () => {
  const mockRepo: any = {
    findMany: jest.fn(),
    count: jest.fn(),
    findOne: jest.fn(),
  };

  const service = new DriverService(mockRepo);

  beforeEach(() => jest.clearAllMocks());

  it('findMany returns paginated drivers', async () => {
    mockRepo.findMany.mockResolvedValue([{ id: 'd1' }]);
    mockRepo.count.mockResolvedValue(1);

    const res = await service.findMany({});

    expect(res.data[0].id).toBe('d1');
    expect(res.totalPages).toBe(1);
  });

  it('findById throws when not found', async () => {
    mockRepo.findOne.mockResolvedValue(null);
    await expect(service.findById('x')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
