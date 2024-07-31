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
  Post,
  Put,
  Query,
  UseGuards,
  UseInterceptors,
  Res,
  UploadedFiles,
  BadRequestException,
  StreamableFile,
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
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import * as path from 'path';
import { promises as fsPromises } from 'fs';
import * as fs from 'fs';

@Controller('/api/letter-type')
export class LetterTypeController {
  constructor(private letterTypeService: LetterTypeService) {}

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @HttpCode(HttpStatus.CREATED)
  @Roles(Role.ADMIN, Role.KADES)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'icon', maxCount: 1 },
      { name: 'template', maxCount: 1 },
    ]),
  )
  async createLetterType(
    @Body() request: CreateLetterTypeRequest,
    @UploadedFiles()
    files: { icon?: Express.Multer.File[]; template?: Express.Multer.File[] },
  ): Promise<WebResponse<ResponseLetterType>> {
    const iconFile = files?.icon?.[0];
    const templateFile = files?.template?.[0];
    const maxSize = new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 });
    const templateType = new FileTypeValidator({
      fileType:
        /application\/(vnd.openxmlformats-officedocument.wordprocessingml.document|vnd.openxmlformats-officedocument.spreadsheetml.sheet)$/,
    });
    const iconType = new FileTypeValidator({
      fileType: /(jpg|jpeg|png|gif|svg)$/,
    });
    if (iconFile) {
      if (!maxSize.isValid(iconFile)) {
        throw new BadRequestException('Icon file is too large');
      }
      if (!iconType.isValid(iconFile)) {
        throw new BadRequestException('Invalid icon file type');
      }
    }

    if (templateFile) {
      if (!maxSize.isValid(templateFile)) {
        throw new BadRequestException('Template file is too large');
      }
      if (!templateType.isValid(templateFile)) {
        throw new BadRequestException('Invalid template file type');
      }
    }
    const result = await this.letterTypeService.createLetterType(
      request,
      iconFile,
      templateFile,
    );
    return {
      data: result,
    };
  }

  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  @HttpCode(HttpStatus.OK)
  async getLetterTypes(
    @Query() options: PaginateOptions & { categoryId?: string },
  ): Promise<WebResponse<ResponseLetterType[]>> {
    const categoryId = options.categoryId
      ? parseInt(options.categoryId, 10)
      : undefined;
    const result = await this.letterTypeService.getLetterTypes({
      ...options,
      categoryId,
    });
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
  @UseGuards(AuthGuard, RolesGuard)
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
  @UseGuards(AuthGuard, RolesGuard)
  @HttpCode(HttpStatus.OK)
  @Roles(Role.ADMIN, Role.KADES)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'icon', maxCount: 1 },
      { name: 'template', maxCount: 1 },
    ]),
  )
  async updateLetterType(
    @Param('id') id: string,
    @Body() request: UpdateLetterTypeRequest,
    @UploadedFiles()
    files: { icon?: Express.Multer.File[]; template?: Express.Multer.File[] },
  ): Promise<WebResponse<ResponseLetterType>> {
    const iconFile = files?.icon?.[0];
    const templateFile = files?.template?.[0];
    const maxSize = new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 });
    const templateType = new FileTypeValidator({
      fileType:
        /application\/(vnd.openxmlformats-officedocument.wordprocessingml.document|vnd.openxmlformats-officedocument.spreadsheetml.sheet)$/,
    });
    const iconType = new FileTypeValidator({
      fileType: /(jpg|jpeg|png|gif|svg)$/,
    });

    if (iconFile) {
      if (!maxSize.isValid(iconFile)) {
        throw new BadRequestException('Icon file is too large');
      }
      if (!iconType.isValid(iconFile)) {
        throw new BadRequestException('Invalid icon file type');
      }
    }

    if (templateFile) {
      if (!maxSize.isValid(templateFile)) {
        throw new BadRequestException('Template file is too large');
      }
      if (!templateType.isValid(templateFile)) {
        throw new BadRequestException('Invalid template file type');
      }
    }

    const result = await this.letterTypeService.updateLetterType(
      parseInt(id),
      request,
      iconFile,
      templateFile,
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
      await fsPromises.access(filePath);
      res.sendFile(filePath);
    } catch (error) {
      throw new NotFoundException('Icon not found');
    }
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
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

  @Get('template/:fileName')
  async getTemplate(@Param('fileName') fileName: string, @Res() res: Response) {
    const filePath = path.join(
      process.cwd(),
      'uploads',
      'letter-type-templates',
      fileName,
    );

    try {
      await fsPromises.access(filePath);
      res.sendFile(filePath);
    } catch (error) {
      throw new NotFoundException('Template not found');
    }
  }

  @Get(':id/download-template')
  @UseGuards(AuthGuard, RolesGuard)
  async downloadTemplate(
    @Param('id') id: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<StreamableFile> {
    const letterType = await this.letterTypeService.getLetterType(parseInt(id));

    if (!letterType.template) {
      throw new NotFoundException('Template not found for this letter type');
    }

    // Menghapus string '\api\letter-type\template\' dari path
    const templatePath = letterType.template.replace(
      '/api/letter-type/template/',
      '',
    );
    const basePath = path.join(
      process.cwd(),
      'uploads',
      'letter-type-templates',
    );
    const filePath = path.join(basePath, templatePath);

    if (!fs.existsSync(filePath)) {
      throw new NotFoundException('Template file not found');
    }

    const file = fs.createReadStream(filePath);
    const fileName = path.basename(filePath);

    res.set({
      'Content-Type': 'application/octet-stream',
      'Content-Disposition': `attachment; filename="${fileName}"`,
    });

    return new StreamableFile(file);
  }
}
