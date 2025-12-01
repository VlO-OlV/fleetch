import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { JwtGuard } from 'src/common/guards/jwt/jwt.guard';
import { UserByIdPipe } from 'src/common/pipes/user-by-id.pipe';
import { UserPayload } from 'src/common/types';

import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserQueryDto } from './dtos/user-query.dto';
import { UserService } from './user.service';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
  public constructor(private readonly userService: UserService) {}

  @Get('/')
  public async getUsers(@Query() query: UserQueryDto) {
    return this.userService.findMany(query);
  }

  @Get('/me')
  public async getMe(@CurrentUser() user: UserPayload) {
    return user;
  }

  @Patch('/me')
  public async updateMe(
    @CurrentUser() user: UserPayload,
    @Body() dto: UpdateUserDto,
  ) {
    return this.userService.updateById(user.id, dto);
  }

  @Get('/:id')
  public async getUserById(@Param('id', UserByIdPipe) id: string) {
    return this.userService.findById(id);
  }

  @Post('/')
  public async createUser(@Body() dto: CreateUserDto) {
    return this.userService.create(dto);
  }

  @Patch('/:id')
  public async updateUser(
    @Param('id', UserByIdPipe) id: string,
    @Body() dto: UpdateUserDto,
  ) {
    return this.userService.updateById(id, dto);
  }

  @Delete('/:id')
  public async deleteUser(@Param('id', UserByIdPipe) id: string) {
    return this.userService.deleteById(id);
  }
}
