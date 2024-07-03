import { Controller, Get, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { WebResponse } from '../model/web.model';
import { AuthGuard } from '../auth/guards/auth.guard';
import { Auth } from '../auth/decorators/auth.decorator';

@Controller('/api/users')
@UseGuards(AuthGuard)
export class UserController {
  constructor(private userService: UserService) {}

  @Get('profile')
  async getProfile(@Auth() user: any): Promise<WebResponse<any>> {
    const profile = await this.userService.getFullProfile(user.id);
    return {
      data: profile,
    };
  }
}
