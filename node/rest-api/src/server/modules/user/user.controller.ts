import { Controller, Get, UseGuards } from '@nestjs/common';

import { User } from '../../decorators';
import { JwtAuthGuard } from '../../guards';
import { JwtPayloadModel } from '../auth';

@Controller('user')
export class UserController {
  @Get('/me')
  @UseGuards(JwtAuthGuard)
  async getUser(@User() user: JwtPayloadModel) {
    return user;
  }
}
