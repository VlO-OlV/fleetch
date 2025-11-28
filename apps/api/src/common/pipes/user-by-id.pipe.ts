import { Injectable, PipeTransform } from '@nestjs/common';
import { UserService } from 'src/modules/user/user.service';

@Injectable()
export class UserByIdPipe implements PipeTransform<string> {
  public constructor(private readonly userService: UserService) {}

  async transform(id: string): Promise<string> {
    await this.userService.findById(id);
    return id;
  }
}
