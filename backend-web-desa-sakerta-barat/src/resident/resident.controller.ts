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
  Request,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ResidentService } from './resident.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import {
  CreateResidentRequest,
  ResidentResponse,
  UpdateResidentRequest,
} from '../model/resident.model';
import { WebResponse } from '../model/web.model';
import { Auth } from '../auth/decorators/auth.decorator';

@Controller('/api/residents')
@UseGuards(AuthGuard)
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
  @HttpCode(204)
  async deleteResident(@Param('id') id: string): Promise<void> {
    await this.residentService.deleteResident(parseInt(id));
  }
}
