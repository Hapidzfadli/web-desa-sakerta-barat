import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { LetterCategoryService } from './letter-category.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import {
  CreateLetterCategoryRequest,
  UpdateLetterCategoryRequest,
  ResponseLetterCategory,
} from '../model/letter-category.model';
import { WebResponse } from '../model/web.model';
import { PaginateOptions } from '../common/utils/paginator';

@Controller('/api/letter-category')
@UseGuards(AuthGuard, RolesGuard)
export class LetterCategoryController {
  constructor(private letterCategoryService: LetterCategoryService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles(Role.ADMIN, Role.KADES)
  async createLetterCategory(
    @Body() request: CreateLetterCategoryRequest,
  ): Promise<WebResponse<ResponseLetterCategory>> {
    const result =
      await this.letterCategoryService.createLetterCategory(request);
    return {
      data: result,
    };
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async getLetterCategories(
    @Query() options: PaginateOptions,
  ): Promise<WebResponse<ResponseLetterCategory[]>> {
    const result =
      await this.letterCategoryService.getLetterCategories(options);
    return {
      data: result.data,
      paging: {
        size: result.meta.itemsPerPage,
        total_page: result.meta.totalPages,
        current_page: result.meta.currentPage,
        // total: result.meta.totalItems,
      },
    };
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getLetterCategory(
    @Param('id') id: string,
  ): Promise<WebResponse<ResponseLetterCategory>> {
    const result = await this.letterCategoryService.getLetterCategory(
      parseInt(id),
    );
    return {
      data: result,
    };
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @Roles(Role.ADMIN, Role.KADES)
  async updateLetterCategory(
    @Param('id') id: string,
    @Body() request: UpdateLetterCategoryRequest,
  ): Promise<WebResponse<ResponseLetterCategory>> {
    const result = await this.letterCategoryService.updateLetterCategory(
      parseInt(id),
      request,
    );
    return {
      data: result,
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @Roles(Role.ADMIN, Role.KADES)
  async deleteLetterCategory(
    @Param('id') id: string,
  ): Promise<WebResponse<string>> {
    await this.letterCategoryService.deleteLetterCategory(parseInt(id));
    return {
      data: 'Letter category deleted successfully',
    };
  }
}
