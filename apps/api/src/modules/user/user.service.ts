import { Injectable } from '@nestjs/common';
import { Prisma } from 'generated/prisma';
import { UserRepository } from 'src/database/repositories/user.repository';

@Injectable()
export class UserService {
  public constructor(private userRepository: UserRepository) {}

  public async findById(id: string) {
    return this.userRepository.findOne({
      id,
    });
  }

  public async findByEmail(email: string) {
    return this.userRepository.findOne({
      email,
    });
  }

  public async updateById(id: string, data: Prisma.UserUncheckedUpdateInput) {
    return this.userRepository.updateOne({ id }, { ...data });
  }
}
