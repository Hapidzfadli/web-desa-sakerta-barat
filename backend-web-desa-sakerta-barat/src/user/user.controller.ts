import {
  Controller,
  Get,
  UseGuards,
  Put,
  Body,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  Param,
  Res,
  NotFoundException,
  ForbiddenException,
  Query,
  BadRequestException,
  Post,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { UserService } from './user.service';
import { WebResponse } from '../model/web.model';
import { AuthGuard } from '../auth/guards/auth.guard';
import { Auth } from '../auth/decorators/auth.decorator';
import {
  ChangePasswordDto,
  UpdateKadesPinDto,
  UpdateUserRequest,
  UserResponse,
} from '../model/user.model';
import { uploadFileAndGetUrl } from '../common/utils/utils';
import * as path from 'path';
import * as fs from 'fs/promises';
import { PaginateOptions } from '../common/utils/paginator';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
@Controller('/api/users')
@UseGuards(AuthGuard)
export class UserController {
  constructor(private userService: UserService) {}

  @Get('profile')
  async getProfile(@Auth() user: any): Promise<WebResponse<UserResponse>> {
    const profile = await this.userService.getFullProfile(user.id);
    return {
      data: profile,
    };
  }

  @Get()
  async getAllUsers(@Query() query: PaginateOptions) {
    return this.userService.findAll(query);
  }

  @Put('profile')
  @UseInterceptors(FileInterceptor('profilePicture'))
  async updateProfile(
    @Auth() user: any,
    @Body() updateData: UpdateUserRequest,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }), // 5MB
          new FileTypeValidator({ fileType: /(jpg|jpeg|png|gif)$/ }),
        ],
        fileIsRequired: false,
      }),
    )
    file?: Express.Multer.File,
  ): Promise<WebResponse<UserResponse>> {
    try {
      let fileUrl: string | undefined;
      if (file) {
        fileUrl = await uploadFileAndGetUrl(file);
        updateData.profilePicture = fileUrl;
      }

      const updatedUser = await this.userService.updateUser(
        user.id,
        updateData,
      );
      return {
        data: updatedUser,
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        return {
          errors: error.message,
        };
      }
      throw error; // Re-throw other types of errors
    }
  }

  @Get('profile-picture/:fileName')
  async getProfilePicture(
    @Param('fileName') fileName: string,
    @Auth() user: any,
    @Res() res: Response,
  ) {
    const requestedUser =
      await this.userService.getUserByProfilePicture(fileName);

    if (!requestedUser) {
      throw new NotFoundException('Profile picture not found');
    }

    if (user.id !== requestedUser.id && user.role !== 'ADMIN') {
      throw new ForbiddenException(
        'You do not have permission to view this profile picture',
      );
    }

    const filePath = path.join(process.cwd(), 'uploads', 'private', fileName);

    try {
      await fs.access(filePath);
      res.sendFile(filePath);
    } catch (error) {
      throw new NotFoundException('Profile picture not found');
    }
  }

  @Put('change-password')
  @UseGuards(AuthGuard)
  async changePassword(
    @Auth() user: any,
    @Body() dto: ChangePasswordDto,
  ): Promise<WebResponse<string>> {
    await this.userService.changePassword(user.id, dto);
    return {
      data: 'Password changed successfully',
    };
  }

  @Put('update-kades-pin')
  @UseGuards(AuthGuard)
  @Roles(Role.KADES)
  async updateKadesPin(
    @Auth() user: any,
    @Body() dto: UpdateKadesPinDto,
  ): Promise<WebResponse<string>> {
    await this.userService.updateKadesPin(user.id, dto);
    return {
      data: 'KADES PIN updated successfully',
    };
  }

  @Post('upload-signature')
  @UseGuards(AuthGuard)
  @Roles(Role.KADES)
  @UseInterceptors(FileInterceptor('signature'))
  async uploadSignature(
    @Auth() user: any,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 }), // 1MB
          new FileTypeValidator({ fileType: /(jpg|jpeg|png)$/ }),
        ],
      }),
    )
    file: Express.Multer.File,
  ): Promise<WebResponse<string>> {
    const signatureUrl = await this.userService.uploadSignature(user.id, file);
    return {
      data: signatureUrl,
    };
  }

  @Get('signature/:fileName')
  async getSignature(
    @Param('fileName') fileName: string,
    @Res() res: Response,
  ) {
    const filePath = path.join(
      process.cwd(),
      'uploads',
      'signatures',
      fileName,
    );

    try {
      await fs.access(filePath);
      res.sendFile(filePath);
    } catch (error) {
      throw new NotFoundException('Signature not found');
    }
  }
}
