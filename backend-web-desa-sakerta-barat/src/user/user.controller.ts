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
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { UserService } from './user.service';
import { WebResponse } from '../model/web.model';
import { AuthGuard } from '../auth/guards/auth.guard';
import { Auth } from '../auth/decorators/auth.decorator';
import { UpdateUserRequest, UserResponse } from '../model/user.model';
import { uploadFileAndGetUrl } from '../common/utils/utils';
import * as path from 'path';
import * as fs from 'fs/promises';
@Controller('/api/users')
@UseGuards(AuthGuard)
export class UserController {
  constructor(private userService: UserService) {}

  @Get('profile')
  async getProfile(@Auth() user: any): Promise<WebResponse<any>> {
    const profile = await this.userService.getFullProfile(user.id);
    return {
      data: profile,
    };
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
    let fileUrl: string | undefined;
    if (file) {
      fileUrl = await uploadFileAndGetUrl(file);
      updateData.profilePicture = fileUrl;
    }

    const updatedUser = await this.userService.updateUser(user.id, updateData);
    return {
      data: updatedUser,
    };
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
}
