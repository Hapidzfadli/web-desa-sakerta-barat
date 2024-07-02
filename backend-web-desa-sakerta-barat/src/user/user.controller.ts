import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterUserRequest, UserResponse } from '../model/user.model';
import { WebResponse } from '../model/web.model';

@Controller('/api/users')
export class UserController {
  constructor(private userService: UserService) {}
}
