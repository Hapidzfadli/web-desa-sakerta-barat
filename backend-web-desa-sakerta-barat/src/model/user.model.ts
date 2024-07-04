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
  isVerified?: boolean;
}
export class UpdateUserRequest {
  name?: string;
  email?: string;
  password?: string;
  isVerified?: boolean;
}
export class LoginUserRequest {
  username: string;
  password: string;
}
