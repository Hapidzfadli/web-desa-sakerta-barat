import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import * as PizZip from 'pizzip';
import * as Docxtemplater from 'docxtemplater';
import * as fs from 'fs';
import * as path from 'path';
import {
  PrintedLetterResponse,
  CreatePrintedLetterDto,
} from '../model/printed-letter.model';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

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
    this.logger.debug(
      `letter request template ${letterRequest.letterType.template}`,
    );

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
      nama_lengkap: letterRequest.resident.name,
      tempat_lahir: letterRequest.resident.placeOfBirth,
      tanggal_lahir:
        letterRequest.resident.dateOfBirth.toLocaleDateString('id-ID'),
      jenis_kelamin: letterRequest.resident.gender,
      nik: letterRequest.resident.nationalId,
      pekerjaan: letterRequest.resident.occupation,
      alamat_lengkap: `${letterRequest.resident.residentialAddress}, RT ${letterRequest.resident.rt}, RW ${letterRequest.resident.rw}, ${letterRequest.resident.district}, ${letterRequest.resident.regency}, ${letterRequest.resident.province} ${letterRequest.resident.postalCode}`,
    });

    const buf = doc.getZip().generate({ type: 'nodebuffer' });

    // Save the printed letter
    const fileName = `letter_${letterRequestId}_${Date.now()}.docx`;
    const printedLettersDir = path.join(basePath, 'printed_letters');

    if (!fs.existsSync(printedLettersDir)) {
      fs.mkdirSync(printedLettersDir, { recursive: true });
    }

    const savedFilePath = path.join(printedLettersDir, fileName);

    fs.writeFileSync(savedFilePath, buf);

    // Save the printed letter information
    const createPrintedLetterDto: CreatePrintedLetterDto = {
      letterRequestId: letterRequestId,
      printedBy: userId,
      printedAt: new Date(),
      fileUrl: `/api/printed-letters/download/${fileName}`,
    };

    await this.prismaService.printedLetter.create({
      data: createPrintedLetterDto,
    });

    // Update the letterRequest status
    await this.prismaService.letterRequest.update({
      where: { id: letterRequestId },
      data: {
        status: 'COMPLETED',
      },
    });

    return buf;
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

  async downloadPrintedLetter(fileName: string): Promise<Buffer> {
    const filePath = path.join(
      process.cwd(),
      'uploads',
      'letter-type-templates',
      'printed_letters',
      fileName,
    );

    if (!fs.existsSync(filePath)) {
      throw new NotFoundException('Printed letter file not found');
    }

    return fs.readFileSync(filePath);
  }
}
