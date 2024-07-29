import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Put,
  Delete,
  Param,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  HttpException,
  HttpStatus,
  ConflictException,
  Res,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ResidentService } from './resident.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import {
  createDocumentRequest,
  CreateResidentRequest,
  DocumentResponse,
  ResidentResponse,
  UpdateResidentRequest,
} from '../model/resident.model';
import { WebResponse } from '../model/web.model';
import { Auth } from '../auth/decorators/auth.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { DocumentType, Role } from '@prisma/client';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Response } from 'express';
@Controller('/api/residents')
@UseGuards(AuthGuard, RolesGuard)
export class ResidentController {
  constructor(private residentService: ResidentService) {}

  @Post()
  @HttpCode(201)
  @UseInterceptors(FileInterceptor('document'))
  async createResident(
    @Body() request: CreateResidentRequest,
    @Auth() user: any,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }), // 5MB
          new FileTypeValidator({ fileType: 'application/pdf' }),
        ],
        fileIsRequired: false,
      }),
    )
    file?: Express.Multer.File,
  ): Promise<WebResponse<ResidentResponse>> {
    try {
      const result = await this.residentService.createResident(
        request,
        user,
        file,
      );
      return {
        data: result,
      };
    } catch (error) {
      if (error instanceof ConflictException) {
        throw new HttpException(error.message, HttpStatus.CONFLICT);
      }
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'An unexpected error occurred',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('/:id')
  async getResident(
    @Param('id') id: string,
  ): Promise<WebResponse<ResidentResponse>> {
    const result = await this.residentService.getResidentById(parseInt(id));
    return {
      data: result,
    };
  }

  @Put('/:id')
  @UseInterceptors(FileInterceptor('document'))
  async updateResident(
    @Param('id') id: string,
    @Body() request: UpdateResidentRequest,
    @Auth() user: any,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }), // 5MB
          new FileTypeValidator({ fileType: 'application/pdf' }),
        ],
        fileIsRequired: false,
      }),
    )
    file?: Express.Multer.File,
  ): Promise<WebResponse<ResidentResponse>> {
    const result = await this.residentService.updateResident(
      parseInt(id),
      request,
      user,
      file,
    );
    return {
      data: result,
    };
  }

  @Delete('/:id')
  @HttpCode(200)
  @Roles(Role.ADMIN, Role.KADES)
  async deleteResident(
    @Param('id') id: string,
    @Auth() user: any,
  ): Promise<WebResponse<string>> {
    await this.residentService.deleteResident(parseInt(id), user);
    return {
      data: 'Resident deleted successfully',
    };
  }

  @Get('/documents/:id/file')
  async getDocumentFile(
    @Param('id') id: string,
    @Auth() user: any,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const { file, mimeType, fileName } =
        await this.residentService.getDocumentFile(parseInt(id), user);

      res.set({
        'Content-Type': mimeType,
        'Content-Disposition': `inline; filename="${fileName}"`,
      });

      return file;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        {
          message: 'An unexpected error occurred while retrieving the document',
          errors: [error.message],
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('/documents')
  @HttpCode(201)
  @UseInterceptors(FileInterceptor('file'))
  async createDocument(
    @Body() request: createDocumentRequest,
    @Auth() user: any,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }), // 5MB
          new FileTypeValidator({ fileType: 'application/pdf' }),
        ],
        fileIsRequired: false,
      }),
    )
    file?: Express.Multer.File,
  ): Promise<DocumentResponse> {
    try {
      const result = await this.residentService.createDocument(
        user,
        request,
        file,
      );
      return result;
    } catch (error) {
      if (error instanceof ConflictException) {
        throw new HttpException(error.message, HttpStatus.CONFLICT);
      }
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'An unexpected error occurred',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put('/documents/:id')
  @HttpCode(200)
  @UseInterceptors(FileInterceptor('file'))
  async updateDocument(
    @Param('id') id: string,
    @Body('type') type: DocumentType,
    @UploadedFile() file: Express.Multer.File,
    @Auth() user: any,
  ): Promise<WebResponse<any>> {
    try {
      const updatedDocument = await this.residentService.updateDocument(
        parseInt(id),
        { type, file },
        user,
      );
      return {
        data: updatedDocument,
        message: 'Document updated successfully',
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        {
          message: 'An unexpected error occurred while updating the document',
          errors: [error.message],
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete('/documents/:id')
  @HttpCode(200)
  async deleteResidentDocument(
    @Param('id') id: string,
    @Auth() user: any,
  ): Promise<WebResponse<void>> {
    try {
      await this.residentService.deleteResidentDocument(parseInt(id), user);
      return {
        data: undefined,
        message: 'Document deleted successfully',
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        {
          message: 'An unexpected error occurred while deleting the document',
          errors: [error.message],
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
