import {
  Injectable,
  Inject,
  ConflictException,
  NotFoundException,
  ForbiddenException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { ValidationService } from '../common/validation.service';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { LetterRequestValidation } from './letter-request.validation';
import { LetterRequest, RequestStatus, Role } from '@prisma/client';
import {
  PaginateOptions,
  PaginatedResult,
  prismaPaginate,
} from '../common/utils/paginator';
import {
  CreateLetterRequestDto,
  ResponseLetterRequest,
  SignLetterRequestDto,
  UpdateLetterRequestDto,
  VerifyLetterRequestDto,
} from '../model/letter-request.model';
import { uploadFileAndGetUrl } from '../common/utils/utils';
import * as PizZip from 'pizzip';
import * as Docxtemplater from 'docxtemplater';
import * as fs from 'fs';
import * as path from 'path';
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
    user: any,
    requestId: number,
    dto: VerifyLetterRequestDto,
  ): Promise<ResponseLetterRequest> {
    const validatedData = this.validationService.validate(
      LetterRequestValidation.VERIFY,
      dto,
    );

    if (user.role !== Role.ADMIN) {
      throw new ForbiddenException('Only admins can verify letter requests');
    }

    const letterRequest = await this.prismaService.letterRequest.findUnique({
      where: { id: requestId },
      include: { resident: { include: { user: true } } },
    });

    if (!letterRequest) {
      throw new NotFoundException('Letter request not found');
    }

    if (letterRequest.status !== RequestStatus.SUBMITTED) {
      throw new ForbiddenException('Only submitted requests can be verified');
    }

    const updatedLetterRequest = await this.prismaService.letterRequest.update({
      where: { id: requestId },
      data: {
        status: validatedData.status,
        notes: validatedData.notes,
        rejectionReason:
          validatedData.status === RequestStatus.REJECTED
            ? validatedData.rejectionReason
            : null,
        approvedAt:
          validatedData.status === RequestStatus.APPROVED
            ? new Date()
            : undefined,
        approvedBy:
          validatedData.status === RequestStatus.APPROVED ? user.id : undefined,
      },
      include: {
        attachments: true,
      },
    });

    return this.mapToResponseLetterRequest(updatedLetterRequest);
  }

  async signLetterRequest(
    user: any,
    requestId: number,
    dto: SignLetterRequestDto,
  ): Promise<ResponseLetterRequest> {
    const validatedData = this.validationService.validate(
      LetterRequestValidation.SIGN,
      dto,
    );

    if (user.role !== Role.KADES) {
      throw new ForbiddenException(
        'Only village head can sign letter requests',
      );
    }

    const letterRequest = await this.prismaService.letterRequest.findUnique({
      where: { id: requestId },
      include: { resident: { include: { user: true } }, letterType: true },
    });

    if (!letterRequest) {
      throw new NotFoundException('Letter request not found');
    }

    if (letterRequest.status !== RequestStatus.APPROVED) {
      throw new ForbiddenException('Only approved requests can be signed');
    }

    let updatedStatus: RequestStatus;
    if (validatedData.status === 'SIGNED') {
      updatedStatus = RequestStatus.SIGNED;
    } else if (validatedData.status === 'REJECTED_BY_KADES') {
      updatedStatus = RequestStatus.REJECTED_BY_KADES;
    } else {
      throw new ForbiddenException('Invalid action');
    }

    const updatedLetterRequest = await this.prismaService.letterRequest.update({
      where: { id: requestId },
      data: {
        status: updatedStatus,
        notes: validatedData.notes,
        rejectionReason:
          validatedData.status === RequestStatus.REJECTED_BY_KADES
            ? validatedData.rejectionReason
            : null,
        letterNumber:
          updatedStatus === RequestStatus.SIGNED
            ? this.generateLetterNumber()
            : undefined,
        signedAt:
          updatedStatus === RequestStatus.SIGNED ? new Date() : undefined,
        signedBy: updatedStatus === RequestStatus.SIGNED ? user.id : undefined,
      },
      include: {
        attachments: true,
      },
    });

    if (updatedStatus === RequestStatus.SIGNED) {
      await this.generateSignedLetter(updatedLetterRequest);
    }

    return this.mapToResponseLetterRequest(updatedLetterRequest);
  }

  async archiveLetterRequest(
    user: any,
    requestId: number,
  ): Promise<ResponseLetterRequest> {
    if (!user || (user.role !== Role.ADMIN && user.role !== Role.KADES)) {
      throw new ForbiddenException(
        'Only admins or village head can archive letter requests',
      );
    }

    const letterRequest = await this.prismaService.letterRequest.findUnique({
      where: { id: requestId },
    });

    if (!letterRequest) {
      throw new NotFoundException('Letter request not found');
    }

    if (letterRequest.status !== RequestStatus.COMPLETED) {
      throw new ForbiddenException('Only completed requests can be archived');
    }

    const archivedLetterRequest = await this.prismaService.letterRequest.update(
      {
        where: { id: requestId },
        data: {
          status: RequestStatus.ARCHIVED,
          ArchivedLetter: {
            create: {
              archivedBy: user.id,
            },
          },
        },
        include: {
          attachments: true,
        },
      },
    );

    return this.mapToResponseLetterRequest(archivedLetterRequest);
  }

  async resubmitLetterRequest(
    userId: number,
    requestId: number,
    dto: UpdateLetterRequestDto,
  ): Promise<ResponseLetterRequest> {
    const letterRequest = await this.prismaService.letterRequest.findUnique({
      where: { id: requestId },
      include: { resident: { include: { user: true } } },
    });

    if (!letterRequest) {
      throw new NotFoundException('Letter request not found');
    }

    if (letterRequest.resident.user.id !== userId) {
      throw new ForbiddenException(
        'You are not allowed to resubmit this letter request',
      );
    }

    if (letterRequest.status !== RequestStatus.REJECTED) {
      throw new ForbiddenException('Only rejected requests can be resubmitted');
    }

    const updatedLetterRequest = await this.prismaService.letterRequest.update({
      where: { id: requestId },
      data: {
        status: RequestStatus.SUBMITTED,
        notes: dto.notes,
        rejectionReason: null,
      },
      include: {
        attachments: true,
      },
    });

    return this.mapToResponseLetterRequest(updatedLetterRequest);
  }

  async getLetterRequests(
    user: any,
    options: PaginateOptions,
  ): Promise<PaginatedResult<ResponseLetterRequest[]>> {
    try {
      const searchFields = ['resident.name', 'letterType.name', 'letterNumber'];
      let filter = options.filter || {};
      const userResident = await this.prismaService.user.findUnique({
        where: { id: user.id },
        select: {
          resident: {
            select: {
              id: true,
            },
          },
        },
      });

      if (user.role === Role.WARGA) {
        filter = {
          ...filter,
          residentId: userResident.resident.id,
        };
      } else if (user.role !== Role.ADMIN && user.role !== Role.KADES) {
        throw new ForbiddenException(
          'You are not authorized to view letter requests',
        );
      }

      const result = await prismaPaginate<LetterRequest>(
        this.prismaService,
        'letterRequest',
        {
          ...options,
          searchFields,
          filter,
          include: {
            resident: true,
            letterType: true,
            attachments: true,
          },
        },
      );

      const mappedData = Array.isArray(result.data)
        ? result.data.map(this.mapToResponseLetterRequest)
        : [this.mapToResponseLetterRequest(result.data as LetterRequest)];

      return {
        data: mappedData,
        meta: result.meta,
      };
    } catch (error) {
      this.logger.error(
        `Error fetching letter requests: ${error.message}`,
        error.stack,
      );
      throw new HttpException(
        'Failed to fetch letter requests',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getLetterRequestById(id: number): Promise<ResponseLetterRequest> {
    const letterRequest = await this.prismaService.letterRequest.findUnique({
      where: { id },
      include: {
        attachments: true,
        letterType: true,
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

    return this.mapToResponseLetterRequestDetail(letterRequest);
  }

  private mapToResponseLetterRequest(
    letterRequest: any,
  ): ResponseLetterRequest {
    const residentDocuments =
      letterRequest.resident?.documents?.map((doc) => ({
        fileName: doc.type,
        fileUrl: `/api/resident/document/${doc.id}/file`,
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

  private mapToResponseLetterRequestDetail(
    letterRequest: any,
  ): ResponseLetterRequest {
    const residentDocuments =
      letterRequest.resident?.documents?.map((doc: any) => ({
        fileName: doc.type,
        fileUrl: `/api/resident/document/${doc.id}/file`,
        documentId: doc.id,
      })) || [];

    const allAttachments = [
      ...(letterRequest.attachments || []),
      ...residentDocuments,
    ];

    return {
      id: letterRequest.id,
      residentId: letterRequest.residentId,
      letterName: letterRequest.letterType?.name,
      letterTypeId: letterRequest.letterTypeId,
      letterNumber: letterRequest.letterNumber,
      requestDate: letterRequest.requestDate,
      status: letterRequest.status,
      notes: letterRequest.notes,
      resident: letterRequest.resident
        ? {
            id: letterRequest.resident.id,
            nationalId: letterRequest.resident.nationalId,
            name: letterRequest.resident.name,
            dateOfBirth: letterRequest.resident.dateOfBirth,
            idCardAddress: letterRequest.resident.idCardAddress,
            residentialAddress: letterRequest.resident.residentialAddress,
            religion: letterRequest.resident.religion,
            maritalStatus: letterRequest.resident.maritalStatus,
            occupation: letterRequest.resident.occupation,
            nationality: letterRequest.resident.nationality,
            placeOfBirth: letterRequest.resident.placeOfBirth,
            gender: letterRequest.resident.gender,
            familyCardNumber: letterRequest.resident.familyCardNumber,
            district: letterRequest.resident.district,
            regency: letterRequest.resident.regency,
            province: letterRequest.resident.province,
            postalCode: letterRequest.resident.postalCode,
            rt: letterRequest.resident.rt,
            rw: letterRequest.resident.rw,
            bloodType: letterRequest.resident.bloodType,
          }
        : null,
      attachments: allAttachments.map((att: any) => ({
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

  private async generateSignedLetter(letterRequest: any): Promise<void> {
    const templatePath = letterRequest.letterType.template.replace(
      '/api/letter-type/template/',
      '',
    );
    const basePath = path.join(
      process.cwd(),
      'uploads',
      'letter-type-templates',
    );
    const filePath = path.join(basePath, templatePath);
    this.logger.debug(`file path :  ${filePath}`);
    if (!fs.existsSync(filePath)) {
      throw new NotFoundException('Template file not found');
    }
    const content = fs.readFileSync(filePath, 'binary');
    const zip = new PizZip(content);
    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
    });
    // Render the document (replace placeholders)
    doc.render({
      tanda_tangan: letterRequest.resident.user.digitalSignature,
    });
    const buf = doc.getZip().generate({ type: 'nodebuffer' });
    // Save the signed letter
    const fileName = `letter_${letterRequest.id}_${Date.now()}.docx`;
    const signedLettersDir = path.join(basePath, 'signed_letters');
    if (!fs.existsSync(signedLettersDir)) {
      fs.mkdirSync(signedLettersDir, { recursive: true });
    }
    const savedFilePath = path.join(signedLettersDir, fileName);
    fs.writeFileSync(savedFilePath, buf);
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
