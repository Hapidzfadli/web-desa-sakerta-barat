import {
  Injectable,
  Inject,
  BadRequestException,
  NotFoundException,
  ConflictException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { ValidationService } from '../common/validation.service';
import { ResidentValidation } from './resident.validation';
import {
  CreateResidentRequest,
  UpdateResidentRequest,
  ResidentResponse,
} from '../model/resident.model';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import * as fs from 'fs/promises';
import * as path from 'path';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { Prisma, Role } from '@prisma/client';

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

      const updateData: Prisma.ResidentUpdateInput = {};
      if ('nationalId' in validatedData)
        updateData.nationalId = validatedData.nationalId;
      if ('name' in validatedData) updateData.name = validatedData.name;
      if ('dateOfBirth' in validatedData)
        updateData.dateOfBirth = validatedData.dateOfBirth;
      if ('idCardAddress' in validatedData)
        updateData.idCardAddress = validatedData.idCardAddress;
      if ('residentialAddress' in validatedData)
        updateData.residentialAddress = validatedData.residentialAddress;
      if ('religion' in validatedData)
        updateData.religion = validatedData.religion;
      if ('maritalStatus' in validatedData)
        updateData.maritalStatus = validatedData.maritalStatus;
      if ('occupation' in validatedData)
        updateData.occupation = validatedData.occupation;
      if ('nationality' in validatedData)
        updateData.nationality = validatedData.nationality;
      if ('placeOfBirth' in validatedData)
        updateData.placeOfBirth = validatedData.placeOfBirth;
      if ('gender' in validatedData) updateData.gender = validatedData.gender;
      if ('familyCardNumber' in validatedData)
        updateData.familyCardNumber = validatedData.familyCardNumber;
      if ('district' in validatedData)
        updateData.district = validatedData.district;
      if ('regency' in validatedData)
        updateData.regency = validatedData.regency;
      if ('province' in validatedData)
        updateData.province = validatedData.province;
      if ('postalCode' in validatedData)
        updateData.postalCode = validatedData.postalCode;

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

  async deleteResident(id: number): Promise<void> {
    try {
      await this.prismaService.resident.delete({
        where: { id },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Resident not found');
      }
      throw error;
    }
  }

  private isValidFile(file: Express.Multer.File): boolean {
    return file.mimetype === 'application/pdf';
  }

  private async saveFile(file: Express.Multer.File): Promise<string> {
    const uploadDir = path.join(process.cwd(), 'uploads');
    await fs.mkdir(uploadDir, { recursive: true });
    const filename = `${Date.now()}-${file.originalname}`;
    const filepath = path.join(uploadDir, filename);
    await fs.writeFile(filepath, file.buffer);
    return `/uploads/${filename}`;
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
      documents: resident.documents.map((doc) => ({
        id: doc.id,
        type: doc.type,
        fileUrl: doc.fileUrl,
      })),
    };
  }
}
