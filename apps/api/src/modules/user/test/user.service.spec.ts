import { BadRequestException } from '@nestjs/common';

import { UserService } from '../user.service';

describe('UserService (unit)', () => {
  const mockRepo: any = {
    findOne: jest.fn(),
    create: jest.fn(),
    updateOne: jest.fn(),
    deleteOne: jest.fn(),
    findMany: jest.fn(),
    count: jest.fn(),
  };
  const mockFile = {
    getFileMetadataById: jest.fn(),
    deleteFileMetadataById: jest.fn(),
  };
  const mockEmail = { sendEmail: jest.fn() };
  const mockRedis = {
    getKey: jest.fn(),
    setKey: jest.fn(),
    deleteKey: jest.fn(),
  };

  const service = new UserService(
    mockRepo,
    mockFile as any,
    mockEmail as any,
    mockRedis as any,
  );

  beforeEach(() => jest.clearAllMocks());

  it('findById returns cached when present', async () => {
    mockRedis.getKey.mockResolvedValue({ id: 'u1', email: 'a@b' });
    const res = await service.findById('u1');
    expect(res.id).toBe('u1');
    expect(mockRedis.getKey).toHaveBeenCalled();
  });

  it('create throws if user exists', async () => {
    mockRepo.findOne.mockResolvedValue({ id: 'exists' });
    await expect(
      service.create({ email: 'a@b' } as any),
    ).rejects.toBeInstanceOf(BadRequestException);
  });
});
