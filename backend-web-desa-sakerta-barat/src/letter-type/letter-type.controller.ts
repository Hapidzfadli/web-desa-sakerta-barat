import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  HttpCode,
  HttpStatus,
  MaxFileSizeValidator,
  NotFoundException,
  Param,
  ParseFilePipe,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  Res,
} from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { LetterTypeService } from './letter-type.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import {
  CreateLetterTypeRequest,
  UpdateLetterTypeRequest,
  ResponseLetterType,
} from '../model/letter-type.model';
import { WebResponse } from '../model/web.model';
import { PaginateOptions } from '../common/utils/paginator';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import * as path from 'path';
import * as fs from 'fs/promises';

@Controller('/api/letter-type')
@UseGuards(AuthGuard, RolesGuard)
export class LetterTypeController {
  constructor(private letterTypeService: LetterTypeService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles(Role.ADMIN, Role.KADES)
  @UseInterceptors(FileInterceptor('icon'))
  async createLetterType(
    @Body() request: CreateLetterTypeRequest,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }), // 5MB
          new FileTypeValidator({ fileType: /(jpg|jpeg|png|gif|svg)$/ }),
        ],
        fileIsRequired: false,
      }),
    )
    iconFile?: Express.Multer.File,
  ): Promise<WebResponse<ResponseLetterType>> {
    const result = await this.letterTypeService.createLetterType(
      request,
      iconFile,
    );
    return {
      data: result,
    };
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async getLetterTypes(
    @Query() options: PaginateOptions,
  ): Promise<WebResponse<ResponseLetterType[]>> {
    const result = await this.letterTypeService.getLetterTypes(options);
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
  async getLetterType(
    @Param('id') id: string,
  ): Promise<WebResponse<ResponseLetterType>> {
    const result = await this.letterTypeService.getLetterType(parseInt(id));
    return {
      data: result,
    };
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @Roles(Role.ADMIN, Role.KADES)
  @UseInterceptors(FileInterceptor('icon'))
  async updateLetterType(
    @Param('id') id: string,
    @Body() request: UpdateLetterTypeRequest,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }), // 5MB
          new FileTypeValidator({ fileType: /(jpg|jpeg|png|gif|svg)$/ }),
        ],
        fileIsRequired: false,
      }),
    )
    iconFile?: Express.Multer.File,
  ): Promise<WebResponse<ResponseLetterType>> {
    const result = await this.letterTypeService.updateLetterType(
      parseInt(id),
      request,
      iconFile,
    );
    return {
      data: result,
    };
  }

  @Get('icon/:fileName')
  async getIcon(@Param('fileName') fileName: string, @Res() res: Response) {
    const filePath = path.join(
      process.cwd(),
      'uploads',
      'letter-type-icons',
      fileName,
    );

    try {
      await fs.access(filePath);
      res.sendFile(filePath);
    } catch (error) {
      throw new NotFoundException('Icon not found');
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @Roles(Role.ADMIN, Role.KADES)
  async deleteLetterType(
    @Param('id') id: string,
  ): Promise<WebResponse<string>> {
    await this.letterTypeService.deleteLetterType(parseInt(id));
    return {
      data: 'Letter type deleted successfully',
    };
  }
}
