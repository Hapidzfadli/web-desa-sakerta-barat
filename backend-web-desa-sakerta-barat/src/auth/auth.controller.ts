import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ThrottlerGuard, Throttle } from '@nestjs/throttler';
import {
  LoginUserRequest,
  RegisterUserRequest,
  UserResponse,
} from '../model/user.model';
import { WebResponse } from '../model/web.model';
import { AuthGuard } from './guards/auth.guard';
import { Auth } from './decorators/auth.decorator';

@Controller('/api/auth')
@UseGuards(ThrottlerGuard)
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/register')
  @HttpCode(200)
  async register(
    @Body() request: RegisterUserRequest,
  ): Promise<WebResponse<UserResponse>> {
    const result = await this.authService.register(request);
    return {
      data: result,
    };
  }

  @Post('/login')
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @HttpCode(200)
  async login(
    @Body() request: LoginUserRequest,
  ): Promise<WebResponse<UserResponse>> {
    const result = await this.authService.login(request);
    return {
      data: result,
    };
  }

  @UseGuards(AuthGuard)
  @Get('/profile')
  getProfile(@Auth() user) {
    return user;
  }
}
