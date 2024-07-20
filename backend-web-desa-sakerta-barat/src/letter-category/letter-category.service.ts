import {
  ConflictException,
  Injectable,
  Inject,
  NotFoundException,
  BadRequestException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { ValidationService } from '../common/validation.service';
import {
  CreateLetterCategoryRequest,
  UpdateLetterCategoryRequest,
  ResponseLetterCategory,
} from '../model/letter-category.model';
import { LetterCategoryValidation } from './letter-category.validation';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import {
  PaginateOptions,
  PaginatedResult,
  prismaPaginate,
} from '../common/utils/paginator';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { LetterCategory } from '@prisma/client';

@Injectable()
export class LetterCategoryService {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private logger: Logger,
    private prismaService: PrismaService,
    private validationService: ValidationService,
  ) {}

  async createLetterCategory(
    request: CreateLetterCategoryRequest,
  ): Promise<ResponseLetterCategory> {
    this.logger.debug(
      `Creating new letter category: ${JSON.stringify(request)}`,
    );

    const validatedData = this.validationService.validate(
      LetterCategoryValidation.CREATE,
      request,
    );

    try {
      const letterCategory = await this.prismaService.letterCategory.create({
        data: {
          name: validatedData.name,
          description: validatedData.description,
        },
      });
      return this.mapToResponseLetterCategory(letterCategory);
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(
          'Letter Category with this name already exists',
        );
      }
      this.logger.error(
        `Error creating letter category: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException('Failed to create letter category');
    }
  }

  async getLetterCategories(
    options: PaginateOptions,
  ): Promise<PaginatedResult<ResponseLetterCategory[]>> {
    try {
      const result = await prismaPaginate<LetterCategory>(
        this.prismaService,
        'LetterCategory',
        {
          ...options,
          select: {
            id: true,
            name: true,
            description: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      );

      // Check if result.data is an array
      const mappedData = Array.isArray(result.data)
        ? result.data.map(this.mapToResponseLetterCategory)
        : [this.mapToResponseLetterCategory(result.data as LetterCategory)];

      return {
        data: mappedData,
        meta: result.meta,
      };
    } catch (error) {
      this.logger.error(
        `Error fetching letter categories: ${error.message}`,
        error.stack,
      );
      throw new HttpException(
        'Failed to fetch letter categories',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getLetterCategory(id: number): Promise<ResponseLetterCategory> {
    const letterCategory = await this.prismaService.letterCategory.findUnique({
      where: { id },
    });

    if (!letterCategory) {
      throw new NotFoundException('Letter Category not found');
    }

    return this.mapToResponseLetterCategory(letterCategory);
  }

  async updateLetterCategory(
    id: number,
    request: UpdateLetterCategoryRequest,
  ): Promise<ResponseLetterCategory> {
    this.logger.debug(
      `Updating letter category ${id}: ${JSON.stringify(request)}`,
    );

    const validatedData = this.validationService.validate(
      LetterCategoryValidation.UPDATE,
      request,
    );

    try {
      const updatedLetterCategory =
        await this.prismaService.letterCategory.update({
          where: { id },
          data: validatedData,
        });
      return this.mapToResponseLetterCategory(updatedLetterCategory);
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('Letter Category not found');
      }
      this.logger.error(
        `Error updating letter category: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException('Failed to update letter category');
    }
  }

  async deleteLetterCategory(id: number): Promise<void> {
    try {
      await this.prismaService.letterCategory.delete({
        where: { id },
      });
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('Letter Category not found');
      }
      this.logger.error(
        `Error deleting letter category: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException('Failed to delete letter category');
    }
  }

  private mapToResponseLetterCategory(
    letterCategory: LetterCategory,
  ): ResponseLetterCategory {
    return {
      id: letterCategory.id,
      name: letterCategory.name,
      description: letterCategory.description,
      createdAt: letterCategory.createdAt,
      updatedAt: letterCategory.updatedAt,
    };
  }
}
