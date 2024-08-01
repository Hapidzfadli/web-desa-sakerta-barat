import {
  Injectable,
  Inject,
  ConflictException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { ValidationService } from '../common/validation.service';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import * as path from 'path';
import { LetterRequestValidation } from './letter-request.validation';
import { RequestStatus, Role } from '@prisma/client';
import {
  PaginateOptions,
  PaginatedResult,
  prismaPaginate,
} from '../common/utils/paginator';
import {
  CreateLetterRequestDto,
  ResponseLetterRequest,
  UpdateLetterRequestDto,
  VerifyLetterRequestDto,
} from '../model/letter-request.model';
import { uploadFileAndGetUrl } from '../common/utils/utils';

@Injectable()
export class LetterRequestService {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private logger: Logger,
    private prismaService: PrismaService,
    private validationService: ValidationService,
  ) {}

  async createLetterRequest(
    userId: number,
    dto: CreateLetterRequestDto,
    attachments?: Express.Multer.File[],
  ): Promise<ResponseLetterRequest> {
    this.logger.debug(
      `Create new letter request for user ${userId}: ${JSON.stringify(dto)}`,
    );
    dto.letterTypeId = Number(dto.letterTypeId);
    const validatedData = this.validationService.validate(
      LetterRequestValidation.CREATE,
      dto,
    );

    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
      include: { resident: { include: { documents: true } } },
    });

    if (!user || !user.resident) {
      throw new NotFoundException('User or Resident not found');
    }

    const existingRequest = await this.prismaService.letterRequest.findFirst({
      where: {
        residentId: user.resident.id,
        letterTypeId: validatedData.letterTypeId,
        status: { not: RequestStatus.COMPLETED },
      },
    });

    if (existingRequest) {
      throw new ConflictException(
        'You already have an unfinished request for this letter type',
      );
    }

    const uploadedAttachments = await this.processAttachments(attachments);
    const residentDocuments = user.resident.documents.map((doc) => ({
      fileName: path.basename(doc.fileUrl),
      fileUrl: doc.fileUrl,
      documentId: doc.id,
    }));

    const allAttachments = [...residentDocuments, ...uploadedAttachments];

    const letterRequest = await this.prismaService.letterRequest.create({
      data: {
        residentId: user.resident.id,
        letterTypeId: validatedData.letterTypeId,
        notes: validatedData.notes,
        attachments: {
          create: allAttachments,
        },
      },
      include: {
        attachments: true,
      },
    });

    return this.mapToResponseLetterRequest(letterRequest);
  }

  async updateLetterRequest(
    userId: number,
    requestId: number,
    dto: UpdateLetterRequestDto,
    attachments?: Express.Multer.File[],
  ): Promise<ResponseLetterRequest> {
    const validatedData = this.validationService.validate(
      LetterRequestValidation.UPDATE,
      dto,
    );

    const letterRequest = await this.prismaService.letterRequest.findUnique({
      where: { id: requestId },
      include: {
        resident: {
          include: {
            user: true,
            documents: true,
          },
        },
        attachments: true,
      },
    });

    if (!letterRequest) {
      throw new NotFoundException('Letter request not found');
    }

    if (letterRequest.resident.user.id !== userId) {
      throw new ForbiddenException(
        'You are not allowed to update this letter request',
      );
    }

    if (letterRequest.status === RequestStatus.COMPLETED) {
      throw new ForbiddenException(
        'You cannot update a completed letter request',
      );
    }

    const uploadedAttachments = await this.processAttachments(attachments);
    const residentDocuments = letterRequest.resident.documents.map((doc) => ({
      fileName: path.basename(doc.fileUrl),
      fileUrl: doc.fileUrl,
      documentId: doc.id,
    }));

    const allAttachments = [...residentDocuments, ...uploadedAttachments];

    const updatedLetterRequest = await this.prismaService.letterRequest.update({
      where: { id: requestId },
      data: {
        notes: validatedData.notes,
        attachments: {
          deleteMany: {},
          create: allAttachments,
        },
      },
      include: {
        attachments: true,
      },
    });

    return this.mapToResponseLetterRequest(updatedLetterRequest);
  }

  async verifyLetterRequest(
    adminId: number,
    requestId: number,
    dto: VerifyLetterRequestDto,
  ): Promise<ResponseLetterRequest> {
    const validatedData = this.validationService.validate(
      LetterRequestValidation.VERIFY,
      dto,
    );

    const admin = await this.prismaService.user.findUnique({
      where: { id: adminId },
    });

    if (!admin || admin.role !== Role.ADMIN) {
      throw new ForbiddenException('Only admins can verify letter requests');
    }

    const letterRequest = await this.prismaService.letterRequest.findUnique({
      where: { id: requestId },
    });

    if (!letterRequest) {
      throw new NotFoundException('Letter request not found');
    }

    const updatedLetterRequest = await this.prismaService.letterRequest.update({
      where: { id: requestId },
      data: {
        status: validatedData.status,
        notes: validatedData.notes,
        letterNumber:
          validatedData.status === RequestStatus.APPROVED
            ? this.generateLetterNumber()
            : undefined,
      },
      include: {
        attachments: true,
      },
    });

    return this.mapToResponseLetterRequest(updatedLetterRequest);
  }

  async getLetterRequests(
    options: PaginateOptions,
  ): Promise<PaginatedResult<ResponseLetterRequest[]>> {
    const result = await prismaPaginate<ResponseLetterRequest[]>(
      this.prismaService,
      'letterRequest',
      {
        ...options,
        include: { attachments: true, resident: true, letterType: true },
      },
    );

    return {
      ...result,
      data: Array.isArray(result.data)
        ? result.data.map(this.mapToResponseLetterRequest)
        : [this.mapToResponseLetterRequest(result.data as any)],
    };
  }

  async getLetterRequestById(id: number): Promise<ResponseLetterRequest> {
    const letterRequest = await this.prismaService.letterRequest.findUnique({
      where: { id },
      include: {
        attachments: true,
        resident: {
          include: {
            documents: true,
          },
        },
      },
    });

    if (!letterRequest) {
      throw new NotFoundException('Letter request not found');
    }

    return this.mapToResponseLetterRequest(letterRequest);
  }

  private mapToResponseLetterRequest(
    letterRequest: any,
  ): ResponseLetterRequest {
    const residentDocuments =
      letterRequest.resident?.documents?.map((doc) => ({
        fileName: path.basename(doc.fileUrl),
        fileUrl: doc.fileUrl,
        documentId: doc.id,
      })) || [];

    const allAttachments = [...letterRequest.attachments, ...residentDocuments];

    return {
      id: letterRequest.id,
      residentId: letterRequest.residentId,
      residentName: letterRequest.resident?.name,
      letterName: letterRequest.letterType?.name,
      letterTypeId: letterRequest.letterTypeId,
      letterNumber: letterRequest.letterNumber,
      requestDate: letterRequest.requestDate,
      status: letterRequest.status,
      notes: letterRequest.notes,
      attachments: allAttachments.map((att) => ({
        fileName: att.fileName,
        fileUrl: att.fileUrl,
        documentId: att.documentId,
      })),
      createdAt: letterRequest.createdAt,
      updatedAt: letterRequest.updatedAt,
    };
  }

  async deleteLetterRequest(userId: number, requestId: number): Promise<void> {
    const letterRequest = await this.prismaService.letterRequest.findUnique({
      where: { id: requestId },
      include: { resident: { include: { user: true } } },
    });

    if (!letterRequest) {
      throw new NotFoundException('Letter request not found');
    }

    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (letterRequest.resident.user.id !== userId && user.role !== Role.ADMIN) {
      throw new ForbiddenException(
        'You are not allowed to delete this letter request',
      );
    }

    if (letterRequest.status === RequestStatus.COMPLETED) {
      throw new ForbiddenException(
        'You cannot delete a completed letter request',
      );
    }

    await this.prismaService.letterRequest.delete({
      where: { id: requestId },
    });
  }

  private generateLetterNumber(): string {
    // Implement your letter number generation logic here
    return `LTR-${Date.now()}`;
  }
  private async processAttachments(attachments?: Express.Multer.File[]) {
    if (!attachments || attachments.length === 0) {
      return [];
    }

    return Promise.all(
      attachments.map(async (file) => {
        const fileUrl = await uploadFileAndGetUrl(
          file,
          'uploads/letter-request-attachments',
          '/api/letter-requests/attachments',
        );

        return {
          fileName: file.originalname,
          fileUrl: fileUrl,
        };
      }),
    );
  }
}
