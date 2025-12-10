import crypto from 'node:crypto';

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Prisma, State, UserRole } from 'generated/prisma';
import { UserRepository } from 'src/database/repositories/user.repository';

import { EmailService } from '../email/email.service';
import { FileService } from '../file/file.service';

import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserQueryDto } from './dtos/user-query.dto';

@Injectable()
export class UserService {
  public constructor(
    private readonly userRepository: UserRepository,
    private readonly fileService: FileService,
    private readonly emailService: EmailService,
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
    {
      profileImageId,
      ...data
    }: UpdateUserDto & { password?: string; state?: State },
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
      search,
      sortBy,
      sortOrder = 'asc',
      state,
    } = query;

    const where: Prisma.UserWhereInput = {
      role: { not: UserRole.ADMIN },
    };
    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { middleName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phoneNumber: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (state) {
      where.state = state;
    }

    const users = await this.userRepository.findMany(
      where,
      limit,
      (page - 1) * limit,
      sortBy ? { [sortBy]: sortOrder } : undefined,
    );
    const totalUsers = await this.userRepository.count(where);

    return {
      data: [...users],
      totalPages: Math.ceil(totalUsers / limit),
      page,
      limit,
    };
  }

  private generatePassword(length: number) {
    const lowerCase = 'abcdefghijklmnopqrstuvwxyz';
    const upperCase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const symbols = '#$&#$&#$&#$&#$&';

    const allChars = lowerCase + upperCase + numbers + symbols;

    let password = '';
    const bytes = crypto.randomBytes(length);

    for (let i = 0; i < length; i++) {
      const randomIndex = bytes[i] % allChars.length;
      password += allChars[randomIndex];
    }

    return password;
  }

  private async hashPassword(password: string) {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  public async create(data: CreateUserDto) {
    const user = await this.findByEmail(data.email);
    if (user) {
      throw new BadRequestException('User with such email already exists');
    }

    const password = this.generatePassword(12);
    const hashedPassword = await this.hashPassword(password);

    await this.userRepository.create({ ...data, password: hashedPassword });

    await this.emailService.sendEmail({
      subject: 'Account Credentials',
      to: data.email,
      message: `Your account has been created. Your password is: ${password}`,
    });
  }

  public async resetPassword(id: string) {
    const password = this.generatePassword(12);
    const hashedPassword = await this.hashPassword(password);

    const user = await this.userRepository.updateOne(
      { id },
      { password: hashedPassword },
    );

    await this.emailService.sendEmail({
      subject: 'Account Credentials',
      to: user.email,
      message: `Your account credentials have been updated. Your password is: ${password}`,
    });
  }

  public async deleteById(id: string) {
    return this.userRepository.deleteOne({ id });
  }

  public async deleteMany(where: Prisma.UserWhereInput) {
    return this.userRepository.deleteMany(where);
  }
}
