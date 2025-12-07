import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from 'generated/prisma';
import { UserRepository } from 'src/database/repositories/user.repository';

import { FileService } from '../file/file.service';

import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserQueryDto } from './dtos/user-query.dto';

@Injectable()
export class UserService {
  public constructor(
    private readonly userRepository: UserRepository,
    private readonly fileService: FileService,
  ) {}

  public async findById(id: string) {
    const user = await this.userRepository.findOne({
      id,
    });

    if (!user) {
      throw new NotFoundException('User with such id not found');
    }

    return user;
  }

  public async findByEmail(email: string) {
    return this.userRepository.findOne({
      email,
    });
  }

  public async updateById(
    id: string,
    { profileImageId, ...data }: UpdateUserDto & { password?: string },
  ) {
    if (profileImageId) {
      const fileMetadata =
        await this.fileService.getFileMetadataById(profileImageId);
      if (!fileMetadata) {
        throw new NotFoundException('Profile image not found');
      }
    }

    const updatedUser = await this.userRepository.updateOne(
      { id },
      {
        ...data,
        profileImageId: profileImageId || undefined,
      },
    );

    if (updatedUser.profileImageId && profileImageId === null) {
      await this.fileService.deleteFileMetadataById(updatedUser.profileImageId);
    }
  }

  public async findMany(query: UserQueryDto) {
    const {
      page = 1,
      limit = 10,
      firstName,
      middleName,
      lastName,
      state,
    } = query;

    const where: Prisma.UserWhereInput = {};
    if (firstName) {
      where.firstName = { contains: firstName, mode: 'insensitive' };
    }
    if (lastName) {
      where.lastName = { contains: lastName, mode: 'insensitive' };
    }
    if (middleName) {
      where.middleName = { contains: middleName, mode: 'insensitive' };
    }
    if (state) {
      where.state = state;
    }

    const users = await this.userRepository.findMany(
      where,
      limit,
      (page - 1) * limit,
    );
    const totalUsers = await this.userRepository.count(where);

    return {
      data: [...users],
      totalPages: Math.ceil(totalUsers / limit),
      page,
      limit,
    };
  }

  public async create(data: CreateUserDto) {
    const password = 'sdfsdfsdfs';
    return this.userRepository.create({ ...data, password });
  }

  public async deleteById(id: string) {
    return this.userRepository.deleteOne({ id });
  }

  public async deleteMany(where: Prisma.UserWhereInput) {
    return this.userRepository.deleteMany(where);
  }
}
