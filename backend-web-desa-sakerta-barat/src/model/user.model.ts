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
  id: number;
  username: string;
  name: string;
  email: string;
  role?: Role;
  token?: string;
  isVerified?: boolean;
  phoneNumber?: string;
  profilePicture?: string;
}

export class UpdateUserRequest {
  name?: string;
  email?: string;
  password?: string;
  isVerified?: boolean;
  phoneNumber?: string;
  profilePicture?: string;
}
export class LoginUserRequest {
  username: string;
  password: string;
}
export class UserResponseWithoutPassword {
  id: number;
  username: string;
  name: string;
  email: string;
  role: Role;
  isVerified: boolean;
  profilePicture?: string;
  phoneNumber?: string;
  createdAt: Date;
  updatedAt: Date;
}

export class ChangePasswordDto {
  oldPassword: string;
  newPassword: string;
}

export class UpdateKadesPinDto {
  pin: string;
}
