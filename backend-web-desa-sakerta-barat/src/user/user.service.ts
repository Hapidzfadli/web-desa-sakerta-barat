import {
  HttpException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
  async getFullProfile(userId: number): Promise<any> {
    try {
      const profile = await this.prismaService.user.findUnique({
        where: { id: userId },
        include: {
          Resident: {
            include: {
              documents: true,
            },
          },
        },
      });

      if (!profile) {
        throw new NotFoundException('User profile not found');
      }

      // Remove sensitive information
      delete profile.password;

      return profile;
    } catch (error) {
      this.logger.error(
        `Error fetching user profile: ${error.message}`,
        error.stack,
      );
      throw new HttpException('Failed to fetch user profile', 500);
    }
  }
}
