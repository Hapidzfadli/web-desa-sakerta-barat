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
import { UpdateUserRequest, UserResponse } from '../model/user.model';
import { UserValidation } from './user.validation';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';

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

  async updateUser(
    userId: number,
    updateData: UpdateUserRequest,
  ): Promise<UserResponse> {
    try {
      // Remove profilePicture from validation as it's handled separately
      const { profilePicture, ...dataToValidate } = updateData;

      const validatedData = this.validationService.validate(
        UserValidation.UPDATE,
        dataToValidate,
      );

      if (validatedData.password) {
        validatedData.password = await bcrypt.hash(validatedData.password, 10);
      }

      // Add profilePicture back if it exists
      if (profilePicture) {
        validatedData.profilePicture = profilePicture;
      }

      const updatedUser = await this.prismaService.user.update({
        where: { id: userId },
        data: validatedData,
      });

      // Remove sensitive information
      delete updatedUser.password;

      return updatedUser;
    } catch (error) {
      this.logger.error(`Error updating user: ${error.message}`, error.stack);
      throw new HttpException('Failed to update user', 500);
    }
  }

  async getUserByProfilePicture(fileName: string): Promise<User | null> {
    return this.prismaService.user.findFirst({
      where: {
        profilePicture: {
          endsWith: fileName,
        },
      },
    });
  }
}
