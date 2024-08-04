import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { ValidationService } from '../common/validation.service';
import { PrismaService } from '../common/prisma.service';
import {
  ChangePasswordDto,
  UpdateKadesPinDto,
  UpdateUserRequest,
  UserResponse,
} from '../model/user.model';
import { UserValidation } from './user.validation';
import * as bcrypt from 'bcrypt';
import { Role, User } from '@prisma/client';
import { PaginateOptions, prismaPaginate } from '../common/utils/paginator';
import { ZodError } from 'zod';
import path from 'path';
import * as fs from 'fs';
import { uploadFileAndGetUrl } from '../common/utils/utils';
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
  async findAll(options: PaginateOptions) {
    try {
      const searchFields = ['username', 'name', 'email'];

      const data = await prismaPaginate<UserResponse>(
        this.prismaService,
        'User',
        {
          ...options,
          searchFields,
          select: {
            id: true,
            username: true,
            name: true,
            email: true,
            role: true,
            isVerified: true,
            profilePicture: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      );
      return data;
    } catch (error) {
      this.logger.error(`Error fetching users: ${error.message}`, error.stack);
      throw new Error('Failed to fetch users');
    }
  }
  async getFullProfile(userId: number): Promise<UserResponse> {
    try {
      const profile = await this.prismaService.user.findUnique({
        where: { id: userId },
        include: {
          resident: {
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
      const { profilePicture, ...dataToValidate } = updateData;

      let validatedData;
      try {
        validatedData = this.validationService.validate(
          UserValidation.UPDATE,
          dataToValidate,
        );
      } catch (error) {
        if (error instanceof ZodError) {
          const errorMessages = error.errors
            .map((err) => `${err.path.join('.')}: ${err.message}`)
            .join(', ');
          throw new BadRequestException(errorMessages);
        }
        throw error;
      }

      if (validatedData.password) {
        validatedData.password = await bcrypt.hash(validatedData.password, 10);
      }

      if (profilePicture) {
        validatedData.profilePicture = profilePicture;
      }

      const updatedUser = await this.prismaService.user.update({
        where: { id: userId },
        data: validatedData,
      });

      delete updatedUser.password;

      return updatedUser;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      this.logger.error(`Error updating user: ${error.message}`, error.stack);
      throw new HttpException('Failed to update user: ' + error.message, 500);
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

  async uploadSignature(
    userId: number,
    file: Express.Multer.File,
  ): Promise<string> {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.role !== Role.KADES) {
      throw new ForbiddenException('Only KADES can upload signature');
    }

    const fileUrl = await uploadFileAndGetUrl(
      file,
      'uploads/signatures',
      '/api/users/signature',
    );

    await this.prismaService.user.update({
      where: { id: userId },
      data: { digitalSignature: fileUrl },
    });

    return fileUrl;
  }

  async changePassword(userId: number, dto: ChangePasswordDto): Promise<void> {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isOldPasswordValid = await bcrypt.compare(
      dto.oldPassword,
      user.password,
    );
    if (!isOldPasswordValid) {
      throw new BadRequestException('Old password is incorrect');
    }

    const hashedNewPassword = await bcrypt.hash(dto.newPassword, 10);
    await this.prismaService.user.update({
      where: { id: userId },
      data: { password: hashedNewPassword },
    });
  }

  async updateKadesPin(userId: number, dto: UpdateKadesPinDto): Promise<void> {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
    });
    if (!user || user.role !== Role.KADES) {
      throw new ForbiddenException('Only KADES can update PIN');
    }

    const hashedPin = await bcrypt.hash(dto.pin, 10);
    await this.prismaService.user.update({
      where: { id: userId },
      data: { signaturePin: hashedPin },
    });
  }

  async verifyKadesPin(userId: number, pin: string): Promise<boolean> {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
    });
    if (!user || user.role !== Role.KADES) {
      throw new ForbiddenException('Invalid user or role');
    }

    if (!user.signaturePin) {
      throw new BadRequestException('Kades PIN not set');
    }

    return bcrypt.compare(pin, user.signaturePin);
  }
}
