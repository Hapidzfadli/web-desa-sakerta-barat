export class RegisterUserRequest {
  username: string;
  email: string;
  password: string;
  first_name: string;
  last_name?: string;
  name: string;
}
export class UserResponse {
  username: string;
  name: string;
  email: string;
  token?: string;
}
export class LoginUserRequest {
  identifier: string;
  password: string;
}
