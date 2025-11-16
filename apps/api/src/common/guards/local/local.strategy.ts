import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import * as bcrypt from 'bcrypt';
import { Strategy } from 'passport-local';
import { UserService } from 'src/modules/user/user.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  public constructor(private userService: UserService) {
    super({
      usernameField: 'email',
    });
  }

  public async validate(email: string, password: string) {
    const user = await this.userService.findByEmail(email);

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
