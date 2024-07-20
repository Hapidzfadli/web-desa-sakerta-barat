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
  CreateLetterTypeRequest,
  UpdateLetterTypeRequest,
  ResponseLetterType,
} from '../model/letter-type.model';
import { LetterTypeValidation } from './letter-type.validation';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import {
  PaginateOptions,
  PaginatedResult,
  prismaPaginate,
} from '../common/utils/paginator';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { LetterType } from '@prisma/client';
import { uploadFileAndGetUrl } from '../common/utils/utils';

@Injectable()
export class LetterTypeService {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private logger: Logger,
    private prismaService: PrismaService,
    private validationService: ValidationService,
  ) {}

  async createLetterType(
    request: CreateLetterTypeRequest,
    iconFile?: Express.Multer.File,
    templateFile?: Express.Multer.File,
  ): Promise<ResponseLetterType> {
    this.logger.debug(`Creating new letter type: ${JSON.stringify(request)}`);

    request.categoryId = Number(request.categoryId);

    const validatedData = this.validationService.validate(
      LetterTypeValidation.CREATE,
      request,
    );

    try {
      let iconUrl: string | undefined;
      if (iconFile) {
        iconUrl = await uploadFileAndGetUrl(
          iconFile,
          'uploads/letter-type-icons',
          '/api/letter-type/icon',
        );
      }

      let templateUrl: string | undefined;
      if (templateFile) {
        templateUrl = await uploadFileAndGetUrl(
          templateFile,
          'uploads/letter-type-templates',
          '/api/letter-type/template',
        );
      }

      const letterType = await this.prismaService.letterType.create({
        data: {
          categoryId: validatedData.categoryId,
          name: validatedData.name,
          description: validatedData.description ?? null,
          requirements: validatedData.requirements ?? null,
          icon: iconUrl ?? null,
          template: templateUrl || null,
        },
      });

      return this.mapToResponseLetterType(letterType);
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(
          'Letter Type with this name already exists',
        );
      }
      this.logger.error(
        `Error creating letter type: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException('Failed to create letter type');
    }
  }

  async getLetterTypes(
    options: PaginateOptions & { categoryId?: number },
  ): Promise<PaginatedResult<ResponseLetterType[]>> {
    try {
      const filter = options.categoryId
        ? { categoryId: options.categoryId }
        : {};
      const searchFields = ['requirements', 'name'];
      const result = await prismaPaginate<LetterType>(
        this.prismaService,
        'letterType',
        { ...options, filter, searchFields },
      );

      const mappedData = Array.isArray(result.data)
        ? result.data.map(this.mapToResponseLetterType)
        : [this.mapToResponseLetterType(result.data as LetterType)];

      return {
        data: mappedData,
        meta: result.meta,
      };
    } catch (error) {
      this.logger.error(
        `Error fetching letter types: ${error.message}`,
        error.stack,
      );
      throw new HttpException(
        'Failed to fetch letter types',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getLetterType(id: number): Promise<ResponseLetterType> {
    const letterType = await this.prismaService.letterType.findUnique({
      where: { id },
    });

    if (!letterType) {
      throw new NotFoundException('Letter Type not found');
    }

    return this.mapToResponseLetterType(letterType);
  }

  async getLetterTypeByCategory(id: number): Promise<ResponseLetterType> {
    const letterType = await this.prismaService.letterType.findUnique({
      where: { id },
    });

    if (!letterType) {
      throw new NotFoundException('Letter Type not found');
    }

    return this.mapToResponseLetterType(letterType);
  }

  async updateLetterType(
    id: number,
    request: UpdateLetterTypeRequest,
    iconFile?: Express.Multer.File,
    templateFile?: Express.Multer.File,
  ): Promise<ResponseLetterType> {
    this.logger.debug(`Updating letter type ${id}: ${JSON.stringify(request)}`);

    request.categoryId = Number(request.categoryId);

    const validatedData = this.validationService.validate(
      LetterTypeValidation.UPDATE,
      request,
    );

    try {
      let iconUrl: string | undefined;
      if (iconFile) {
        iconUrl = await uploadFileAndGetUrl(
          iconFile,
          'uploads/letter-type-icons',
          '/api/letter-type/icon',
        );
      }

      let templateUrl: string | undefined;
      if (templateFile) {
        templateUrl = await uploadFileAndGetUrl(
          templateFile,
          'uploads/letter-type-templates',
          '/api/letter-type/template',
        );
      }

      const updatedLetterType = await this.prismaService.letterType.update({
        where: { id },
        data: {
          ...validatedData,
          icon: iconUrl || '',
          template: templateUrl || '',
        },
      });
      return this.mapToResponseLetterType(updatedLetterType);
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('Letter Type not found');
      }
      this.logger.error(
        `Error updating letter type: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException('Failed to update letter type');
    }
  }

  async deleteLetterType(id: number): Promise<void> {
    try {
      await this.prismaService.letterType.delete({
        where: { id },
      });
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('Letter Type not found');
      }
      this.logger.error(
        `Error deleting letter type: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException('Failed to delete letter type');
    }
  }

  private mapToResponseLetterType(letterType: LetterType): ResponseLetterType {
    return {
      id: letterType.id,
      categoryId: letterType.categoryId,
      name: letterType.name,
      description: letterType.description,
      requirements: letterType.requirements,
      icon: letterType.icon,
      template: letterType.template,
      createdAt: letterType.createdAt,
      updatedAt: letterType.updatedAt,
    };
  }
}
