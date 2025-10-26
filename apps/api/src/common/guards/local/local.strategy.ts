import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import * as bcrypt from 'bcrypt';
import { Strategy } from 'passport-local';
import { UserRepository } from 'src/database/repositories/user.repository';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  public constructor(private userRepository: UserRepository) {
    super({
      usernameField: 'email',
    });
  }

  public async validate(email: string, password: string) {
    const user = await this.userRepository.findOne({ email });

    if (!user) {
      throw new NotFoundException('User with such email not found');
    }

    const { password: hashedPassword, ...userData } = user;

    const isMatches = await bcrypt.compare(password, hashedPassword);

    if (!isMatches) {
      throw new UnauthorizedException('Wrong password');
    }

    return userData;
  }
}
