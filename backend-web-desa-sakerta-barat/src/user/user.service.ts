import { HttpException, Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { ValidationService } from '../common/validation.service';
import { PrismaService } from '../common/prisma.service';
import { UserResponse } from '../model/user.model';

@Injectable()
export class UserService {
  constructor(
    private validationService: ValidationService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private logger: Logger,
    private prismaService: PrismaService,
  ) {}

  async findOne(username: string): Promise<UserResponse> {
    const user = await this.prismaService.user.findUnique({
      where: { username },
    });
    if (!user) {
      throw new HttpException('User not found', 404);
    }
    return user;
  }
}
