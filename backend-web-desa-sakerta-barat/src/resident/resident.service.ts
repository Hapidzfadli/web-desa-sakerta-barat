import {
  Injectable,
  Inject,
  BadRequestException,
  NotFoundException,
  ConflictException,
  HttpException,
  HttpStatus,
  ForbiddenException,
  InternalServerErrorException,
  StreamableFile,
} from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { ValidationService } from '../common/validation.service';
import { DocumentValidation, ResidentValidation } from './resident.validation';
import {
  CreateResidentRequest,
  UpdateResidentRequest,
  ResidentResponse,
  createDocumentRequest,
  DocumentResponse,
} from '../model/resident.model';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import * as fs from 'fs/promises';
import * as fss from 'fs';
import * as path from 'path';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { DocumentType, Prisma, Role } from '@prisma/client';
import { uploadFileAndGetUrl } from '../common/utils/utils';

@Injectable()
export class ResidentService {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private logger: Logger,
    private prismaService: PrismaService,
    private validationService: ValidationService,
  ) {}

  async createResident(
    request: CreateResidentRequest,
    user: any,
    file?: Express.Multer.File,
  ): Promise<ResidentResponse> {
    this.logger.debug(`Creating new resident: ${JSON.stringify(request)}`);

    if (user.role === Role.WARGA) {
      const existingResidentCount = await this.prismaService.resident.count({
        where: { userId: user.id },
      });

      if (existingResidentCount > 0) {
        throw new ConflictException(
          'You cannot have more than one resident data',
        );
      }
    }

    const validatedData = this.validationService.validate(
      ResidentValidation.CREATE,
      request,
    );

    if (file && !this.isValidFile(file)) {
      throw new BadRequestException(
        'Invalid file type. Only PDF files are allowed.',
      );
    }

    try {
      const resident = await this.prismaService.resident.create({
        data: {
          nationalId: validatedData.nationalId,
          name: validatedData.name,
          dateOfBirth: validatedData.dateOfBirth,
          idCardAddress: validatedData.idCardAddress,
          residentialAddress: validatedData.residentialAddress,
          userId: validatedData.userId,
          religion: validatedData.religion,
          maritalStatus: validatedData.maritalStatus,
          occupation: validatedData.occupation,
          nationality: validatedData.nationality,
          placeOfBirth: validatedData.placeOfBirth,
          gender: validatedData.gender,
          familyCardNumber: validatedData.familyCardNumber,
          district: validatedData.district,
          regency: validatedData.regency,
          province: validatedData.province,
          postalCode: validatedData.postalCode,
          rt: validatedData.rt,
          rw: validatedData.rw,
          bloodType: validatedData.bloodType,
          documents: file
            ? {
                create: {
                  type: validatedData.documentType,
                  fileUrl: await this.saveFile(file),
                },
              }
            : undefined,
        },
        include: { documents: true },
      });

      return this.mapToResidentResponse(resident);
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(
          'Resident with this national ID already exists',
        );
      }
      throw error;
    }
  }

  async getResidentById(id: number): Promise<ResidentResponse> {
    const resident = await this.prismaService.resident.findUnique({
      where: { userId: id },
      include: { documents: true },
    });

    if (!resident) {
      throw new NotFoundException('Resident not found');
    }

    return this.mapToResidentResponse(resident);
  }

  async updateResident(
    id: number,
    request: UpdateResidentRequest,
    user: any,
    file?: Express.Multer.File,
  ): Promise<ResidentResponse> {
    this.logger.debug(`Updating resident ${id}: ${JSON.stringify(request)}`);
    const validatedData = this.validationService.validate(
      ResidentValidation.UPDATE,
      request,
    );

    if (file && !this.isValidFile(file)) {
      throw new BadRequestException(
        'Invalid file type. Only PDF files are allowed.',
      );
    }

    try {
      const existingResident = await this.prismaService.resident.findUnique({
        where: { userId: id },
      });

      if (!existingResident) {
        throw new NotFoundException(`Resident with ID ${id} not found`);
      }

      if (user.role === Role.WARGA && existingResident.userId !== user.id) {
        throw new HttpException(
          'You do not have permission to update this resident data',
          HttpStatus.FORBIDDEN,
        );
      }

      const updateData: Prisma.ResidentUpdateInput = {
        nationalId: validatedData.nationalId,
        name: validatedData.name,
        dateOfBirth: validatedData.dateOfBirth,
        idCardAddress: validatedData.idCardAddress,
        residentialAddress: validatedData.residentialAddress,
        religion: validatedData.religion,
        maritalStatus: validatedData.maritalStatus,
        occupation: validatedData.occupation,
        nationality: validatedData.nationality,
        placeOfBirth: validatedData.placeOfBirth,
        gender: validatedData.gender,
        familyCardNumber: validatedData.familyCardNumber,
        district: validatedData.district,
        regency: validatedData.regency,
        province: validatedData.province,
        postalCode: validatedData.postalCode,
        rt: validatedData.rt,
        rw: validatedData.rw,
        bloodType: validatedData.bloodType,
      };

      if (file) {
        updateData.documents = {
          create: {
            type: validatedData.documentType,
            fileUrl: await this.saveFile(file),
          },
        };
      }

      // Perform the update
      const resident = await this.prismaService.resident.update({
        where: { userId: id },
        data: updateData,
        include: { documents: true },
      });

      return this.mapToResidentResponse(resident);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException(
            'Update failed. The provided data conflicts with existing records.',
          );
        }
      }
      this.logger.error(
        `Error updating resident: ${error.message}`,
        error.stack,
      );
      throw new HttpException(
        'An error occurred while updating the resident',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteResident(id: number, user: any): Promise<string> {
    if (user.role !== Role.ADMIN && user.role !== Role.KADES) {
      throw new ForbiddenException('Only ADMIN or KADES can delete residents');
    }

    try {
      await this.prismaService.resident.delete({
        where: { id },
      });
      return 'Resident deleted successfully';
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Resident not found');
      }
      this.logger.error(
        `Error deleting resident: ${error.message}`,
        error.stack,
      );
      throw new HttpException(
        'An error occurred while deleting the resident',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Dokument
  async getDocumentFile(
    documentId: number,
    user: any,
  ): Promise<{ file: StreamableFile; mimeType: string; fileName: string }> {
    const document = await this.prismaService.document.findUnique({
      where: { id: documentId },
      include: { resident: true },
    });

    if (!document) {
      throw new NotFoundException('Document not found');
    }

    if (user.role !== Role.ADMIN && user.id !== document.resident.userId) {
      throw new ForbiddenException(
        'You do not have permission to view this document',
      );
    }

    if (!document.fileUrl) {
      throw new NotFoundException('Document file not found');
    }

    const filePath = path.join(
      process.cwd(),
      document.fileUrl.replace(/^\//, ''),
    );

    if (!fss.existsSync(filePath)) {
      throw new NotFoundException('Document file not found on server');
    }

    const file = fss.createReadStream(filePath);
    const mimeType = this.getMimeType(filePath);
    const fileName = path.basename(filePath);

    return {
      file: new StreamableFile(file),
      mimeType,
      fileName,
    };
  }

  private getMimeType(filePath: string): string {
    const ext = path.extname(filePath).toLowerCase();
    switch (ext) {
      case '.pdf':
        return 'application/pdf';
      case '.jpg':
      case '.jpeg':
        return 'image/jpeg';
      case '.png':
        return 'image/png';
      default:
        return 'application/octet-stream';
    }
  }

  async createDocument(
    user: any,
    request: createDocumentRequest,
    file?: Express.Multer.File,
  ): Promise<DocumentResponse> {
    const resident = await this.prismaService.resident.findUnique({
      where: { userId: user.id },
      include: { user: true, documents: true },
    });

    if (!resident) {
      throw new NotFoundException('Resident not found');
    }

    if (user.role !== Role.ADMIN && user.id !== resident.userId) {
      throw new ForbiddenException(
        'You do not have permission to add documents for this resident',
      );
    }

    const existingDocument = resident.documents.find(
      (doc) => doc.type === request.type,
    );

    if (existingDocument) {
      throw new ConflictException(
        `A document of type ${request.type} already exists for this resident`,
      );
    }

    if (file && !this.isValidFile(file)) {
      throw new BadRequestException(
        'Invalid file type. Only PDF files are allowed.',
      );
    }

    try {
      const validatedData = this.validationService.validate(
        DocumentValidation.CREATE,
        request,
      );
      const document = await this.prismaService.document.create({
        data: {
          residentId: resident.id,
          type: validatedData.type,
          fileUrl: await this.saveFile(file),
        },
      });
      return this.mapToDocumentResponse(document);
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('Document with this type already exists');
      }
      throw error;
    }
  }

  async updateDocument(
    documentId: number,
    updateData: { type?: DocumentType; file?: Express.Multer.File },
    user: any,
  ): Promise<any> {
    const document = await this.prismaService.document.findUnique({
      where: { id: documentId },
      include: { resident: true },
    });

    if (!document) {
      throw new NotFoundException('Document not found');
    }

    if (user.role !== Role.ADMIN && user.id !== document.resident.userId) {
      throw new ForbiddenException(
        'You do not have permission to edit this document',
      );
    }

    let fileUrl = document.fileUrl;

    if (updateData.file) {
      if (document.fileUrl) {
        const oldFilePath = path.join(
          process.cwd(),
          document.fileUrl.replace(/^\//, ''),
        );
        try {
          await fs.unlink(oldFilePath);
        } catch (error) {
          this.logger.warn(`Failed to delete old file: ${oldFilePath}`, error);
        }
      }
      fileUrl = await this.saveFile(updateData.file);
    }

    const updateObject: Prisma.DocumentUpdateInput = {
      fileUrl: fileUrl,
    };

    if (updateData.type) {
      updateObject.type = updateData.type;
    }

    try {
      const updatedDocument = await this.prismaService.document.update({
        where: { id: documentId },
        data: updateObject,
      });

      return updatedDocument;
    } catch (error) {
      throw new InternalServerErrorException('Failed to update the document');
    }
  }

  async deleteResidentDocument(documentId: number, user: any): Promise<void> {
    const document = await this.prismaService.document.findUnique({
      where: { id: documentId },
      include: { resident: true },
    });

    if (!document) {
      throw new NotFoundException('Document not found');
    }

    if (user.role !== Role.ADMIN && user.id !== document.resident.userId) {
      throw new ForbiddenException(
        'You do not have permission to delete this document',
      );
    }

    if (document.fileUrl) {
      const filePath = path.join(
        process.cwd(),
        document.fileUrl.replace(/^\//, ''),
      );
      try {
        await fs.unlink(filePath);
      } catch (error) {
        throw new InternalServerErrorException(
          'Failed to delete the physical file',
        );
      }
    }

    try {
      await this.prismaService.document.delete({
        where: { id: documentId },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to delete the document record',
      );
    }
  }

  // Fungsi
  private isValidFile(file: Express.Multer.File): boolean {
    return file.mimetype === 'application/pdf';
  }

  private async saveFile(file: Express.Multer.File): Promise<string> {
    try {
      const uploadDir = 'uploads/documents';
      const urlPrefix = '/api/residents/documents';
      return await uploadFileAndGetUrl(file, uploadDir, urlPrefix);
    } catch (error) {
      this.logger.error(`Error saving file: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to save the file');
    }
  }

  private mapToDocumentResponse(document: any): DocumentResponse {
    return {
      id: document.id,
      type: document.type,
      fileUrl: document.fileUrl,
    };
  }

  private mapToResidentResponse(resident: any): ResidentResponse {
    return {
      id: resident.id,
      nationalId: resident.nationalId,
      name: resident.name,
      dateOfBirth: resident.dateOfBirth,
      idCardAddress: resident.idCardAddress,
      residentialAddress: resident.residentialAddress,
      religion: resident.religion,
      maritalStatus: resident.maritalStatus,
      occupation: resident.occupation,
      nationality: resident.nationality,
      placeOfBirth: resident.placeOfBirth,
      gender: resident.gender,
      familyCardNumber: resident.familyCardNumber,
      district: resident.district,
      regency: resident.regency,
      province: resident.province,
      postalCode: resident.postalCode,
      rt: resident.rt,
      rw: resident.rw,
      bloodType: resident.bloodType,
      documents: resident.documents.map((doc) => ({
        id: doc.id,
        type: doc.type,
        fileUrl: doc.fileUrl,
      })),
    };
  }
}
