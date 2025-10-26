import { Injectable } from '@nestjs/common';
import { UserRepository } from 'src/database/repositories/user.repository';

@Injectable()
export class UserService {
  public constructor(private userRepository: UserRepository) {}
}
