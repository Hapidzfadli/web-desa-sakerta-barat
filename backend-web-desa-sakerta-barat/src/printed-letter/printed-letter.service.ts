import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import * as fs from 'fs';
import * as path from 'path';
import {
  PrintedLetterResponse,
  CreatePrintedLetterDto,
} from '../model/printed-letter.model';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import * as libre from 'libreoffice-convert';
import { promisify } from 'util';
import { RequestStatus } from '@prisma/client';
const libreConvert = promisify(libre.convert);
@Injectable()
export class PrintedLetterService {
  constructor(
    private prismaService: PrismaService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private logger: Logger,
  ) {}

  async printLetter(letterRequestId: number, userId: number): Promise<Buffer> {
    const letterRequest = await this.prismaService.letterRequest.findUnique({
      where: { id: letterRequestId },
      include: {
        resident: true,
        letterType: true,
      },
    });

    if (!letterRequest) {
      throw new NotFoundException('Letter request not found');
    }

    let filePath: string;
    if (letterRequest.status === RequestStatus.APPROVED) {
      filePath = this.convertApiPathToFilePath(
        letterRequest.approvedLetterPath,
      );
    } else if (
      letterRequest.status === RequestStatus.SIGNED ||
      letterRequest.status === RequestStatus.COMPLETED ||
      letterRequest.status === RequestStatus.ARCHIVED
    ) {
      filePath = this.convertApiPathToFilePath(letterRequest.signedLetterPath);
    } else {
      throw new ForbiddenException('This letter request cannot be printed');
    }

    if (!filePath || !fs.existsSync(filePath)) {
      throw new NotFoundException('Letter file not found');
    }

    const content = fs.readFileSync(filePath);

    const pdfBuf = await libreConvert(content, '.pdf', undefined);
    const createPrintedLetterDto: CreatePrintedLetterDto = {
      letterRequestId: letterRequestId,
      printedBy: userId,
      printedAt: new Date(),
      fileUrl: filePath,
    };

    await this.prismaService.printedLetter.create({
      data: createPrintedLetterDto,
    });

    return pdfBuf;
  }

  async getPrintedLettersByResident(
    residentId: number,
  ): Promise<PrintedLetterResponse[]> {
    return this.prismaService.printedLetter.findMany({
      where: {
        letterRequest: {
          residentId: residentId,
        },
      },
      include: {
        letterRequest: true,
        printedByUser: true,
      },
    });
  }

  async downloadPrintedLetter(letterRequestId: number): Promise<Buffer> {
    const letterRequest = await this.prismaService.letterRequest.findUnique({
      where: { id: letterRequestId },
    });

    if (!letterRequest) {
      throw new NotFoundException('Letter request not found');
    }

    if (
      letterRequest.status !== RequestStatus.SIGNED &&
      letterRequest.status !== RequestStatus.COMPLETED &&
      letterRequest.status !== RequestStatus.ARCHIVED
    ) {
      throw new ForbiddenException('This letter is not available for download');
    }

    if (!letterRequest.signedLetterPath) {
      throw new NotFoundException('Signed letter file not found');
    }

    const filePath = this.convertApiPathToFilePath(
      letterRequest.signedLetterPath,
    );

    if (!fs.existsSync(filePath)) {
      throw new NotFoundException('Letter file not found');
    }

    return fs.readFileSync(filePath);
  }

  async previewLetter(letterRequestId: number): Promise<Buffer> {
    const letterRequest = await this.prismaService.letterRequest.findUnique({
      where: { id: letterRequestId },
      include: {
        resident: true,
        letterType: true,
      },
    });

    if (!letterRequest) {
      throw new NotFoundException('Letter request not found');
    }

    let filePath: string;
    if (letterRequest.status === RequestStatus.APPROVED) {
      filePath = this.convertApiPathToFilePath(
        letterRequest.approvedLetterPath,
      );
    } else if (
      letterRequest.status === RequestStatus.SIGNED ||
      letterRequest.status === RequestStatus.COMPLETED ||
      letterRequest.status === RequestStatus.ARCHIVED
    ) {
      filePath = this.convertApiPathToFilePath(letterRequest.signedLetterPath);
    } else {
      throw new ForbiddenException('This letter request cannot be printed');
    }

    if (!filePath || !fs.existsSync(filePath)) {
      throw new NotFoundException('Letter file not found');
    }

    const content = fs.readFileSync(filePath);
    const pdfBuf = await libreConvert(content, '.pdf', undefined);

    return pdfBuf;
  }

  private convertApiPathToFilePath(apiPath: string): string {
    const fileName = path.basename(apiPath);
    let folderName: string;

    if (apiPath.includes('/api/letter-requests/signed/')) {
      folderName = 'signed_letters';
    } else if (apiPath.includes('/api/letter-requests/approved/')) {
      folderName = 'approved_letters';
    } else {
      throw new Error('Unknown letter type');
    }

    return path.join(process.cwd(), 'uploads', folderName, fileName);
  }
}
