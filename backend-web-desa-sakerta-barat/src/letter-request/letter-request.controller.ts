import {
  Controller,
  Post,
  Put,
  Get,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  UploadedFiles,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  Res,
} from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { LetterRequestService } from './letter-request.service';
import { Response } from 'express';
import {
  CreateLetterRequestDto,
  UpdateLetterRequestDto,
  VerifyLetterRequestDto,
  ResponseLetterRequest,
  SignLetterRequestDto,
} from '../model/letter-request.model';
import { WebResponse } from '../model/web.model';
import { PaginateOptions } from '../common/utils/paginator';
import { Auth } from '../auth/decorators/auth.decorator';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('api/letter-requests')
@UseGuards(AuthGuard, RolesGuard)
export class LetterRequestController {
  constructor(private letterRequestService: LetterRequestService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles(Role.WARGA)
  @UseInterceptors(FilesInterceptor('attachments'))
  async createLetterRequest(
    @Auth() user: any,
    @Body() createDto: CreateLetterRequestDto,
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }), // 5MB
          new FileTypeValidator({ fileType: 'application/pdf' }),
        ],
        fileIsRequired: false,
      }),
    )
    attachments: Express.Multer.File[],
  ): Promise<WebResponse<ResponseLetterRequest>> {
    const parsedDto = {
      ...createDto,
      letterTypeId: Number(createDto.letterTypeId),
    };
    const result = await this.letterRequestService.createLetterRequest(
      user.id,
      parsedDto,
      attachments,
    );
    return {
      data: result,
    };
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @Roles(Role.WARGA)
  @UseInterceptors(FilesInterceptor('attachments'))
  async updateLetterRequest(
    @Auth() user: any,
    @Param('id') id: string,
    @Body() updateDto: UpdateLetterRequestDto,
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }), // 5MB
          new FileTypeValidator({ fileType: 'application/pdf' }),
        ],
        fileIsRequired: false,
      }),
    )
    attachments?: Express.Multer.File[],
  ): Promise<WebResponse<ResponseLetterRequest>> {
    const result = await this.letterRequestService.updateLetterRequest(
      user.id,
      parseInt(id),
      updateDto,
      attachments,
    );
    return {
      data: result,
    };
  }

  @Put(':id/complete')
  @HttpCode(HttpStatus.OK)
  async completeLetterRequest(
    @Auth() user: any,
    @Param('id') id: string,
  ): Promise<WebResponse<ResponseLetterRequest>> {
    const result = await this.letterRequestService.completeLetterRequest(
      user,
      parseInt(id),
    );
    return {
      data: result,
    };
  }

  @Put(':id/verify')
  @HttpCode(HttpStatus.OK)
  @Roles(Role.ADMIN, Role.KADES)
  async verifyLetterRequest(
    @Auth() user: any,
    @Param('id') id: string,
    @Body() verifyDto: VerifyLetterRequestDto,
  ): Promise<WebResponse<ResponseLetterRequest>> {
    const result = await this.letterRequestService.verifyLetterRequest(
      user,
      parseInt(id),
      verifyDto,
    );
    return {
      data: result,
    };
  }

  @Put(':id/sign')
  @HttpCode(HttpStatus.OK)
  @Roles(Role.KADES)
  async signLetterRequest(
    @Auth() user: any,
    @Param('id') id: string,
    @Body() signDto: SignLetterRequestDto,
  ): Promise<WebResponse<ResponseLetterRequest>> {
    const result = await this.letterRequestService.signLetterRequest(
      user,
      parseInt(id),
      signDto,
    );
    return {
      data: result,
    };
  }

  @Put(':id/resubmit')
  @HttpCode(HttpStatus.OK)
  @Roles(Role.WARGA)
  async resubmitLetterRequest(
    @Auth() user: any,
    @Param('id') id: string,
    @Body() updateDto: UpdateLetterRequestDto,
  ): Promise<WebResponse<ResponseLetterRequest>> {
    const result = await this.letterRequestService.resubmitLetterRequest(
      user,
      parseInt(id),
      updateDto,
    );
    return {
      data: result,
    };
  }

  @Put(':id/archive')
  @HttpCode(HttpStatus.OK)
  @Roles(Role.ADMIN, Role.KADES)
  async archiveLetterRequest(
    @Auth() user: any,
    @Param('id') id: string,
  ): Promise<WebResponse<ResponseLetterRequest>> {
    const result = await this.letterRequestService.archiveLetterRequest(
      user,
      parseInt(id),
    );
    return {
      data: result,
    };
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  async getLetterRequests(
    @Auth() user: any,
    @Query() options: PaginateOptions,
  ): Promise<WebResponse<ResponseLetterRequest[]>> {
    const result = await this.letterRequestService.getLetterRequests(
      user,
      options,
    );
    return {
      data: result.data,
      paging: {
        size: result.meta.itemsPerPage,
        total_page: result.meta.totalPages,
        current_page: result.meta.currentPage,
        total: result.meta.totalItems,
      },
    };
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getLetterRequestById(
    @Param('id') id: string,
  ): Promise<WebResponse<ResponseLetterRequest>> {
    const result = await this.letterRequestService.getLetterRequestById(
      parseInt(id),
    );
    return {
      data: result,
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @Roles(Role.WARGA, Role.ADMIN, Role.KADES)
  async deleteLetterRequest(
    @Auth() user: any,
    @Param('id') id: string,
  ): Promise<WebResponse<string>> {
    await this.letterRequestService.deleteLetterRequest(user.id, parseInt(id));
    return {
      data: 'Letter request deleted successfully',
    };
  }

  @Get('attachments/:filename')
  @HttpCode(HttpStatus.OK)
  @Roles(Role.WARGA, Role.ADMIN, Role.KADES)
  async getAttachment(
    @Param('filename') filename: string,
    @Res() res: Response,
  ): Promise<void> {
    const { file, mimeType, fileName } =
      await this.letterRequestService.getAttachmentFile(filename);

    res.set({
      'Content-Type': mimeType,
      'Content-Disposition': `inline; filename="${fileName}"`,
    });
    res.send(file);
  }
}
