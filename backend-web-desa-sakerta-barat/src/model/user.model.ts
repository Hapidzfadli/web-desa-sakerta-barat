import { Role } from '@prisma/client';

export class RegisterUserRequest {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName?: string;
  name: string;
}
export class UserResponse {
  username: string;
  name: string;
  email: string;
  role?: Role;
  token?: string;
}
export class LoginUserRequest {
  username: string;
  password: string;
}
