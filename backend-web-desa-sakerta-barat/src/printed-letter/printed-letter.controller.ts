import { Controller, Get, Param, UseGuards, Res } from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { PrintedLetterService } from './printed-letter.service';
import { Auth } from '../auth/decorators/auth.decorator';
import { Response } from 'express';
import { PrintedLetterResponse } from '../model/printed-letter.model';
import { PrismaService } from '../common/prisma.service';

@Controller('api/printed-letters')
@UseGuards(AuthGuard, RolesGuard)
export class PrintedLetterController {
  constructor(
    private printedLetterService: PrintedLetterService,
    private prismaService: PrismaService,
  ) {}

  @Get('print/:letterRequestId')
  @Roles(Role.ADMIN, Role.KADES, Role.WARGA)
  async printLetter(
    @Param('letterRequestId') letterRequestId: string,
    @Auth() user: any,
    @Res() res: Response,
  ): Promise<void> {
    const buffer = await this.printedLetterService.printLetter(
      parseInt(letterRequestId),
      user.id,
    );

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="letter-${letterRequestId}.pdf"`,
    });

    res.send(buffer);
  }

  @Get('resident/:residentId')
  @Roles(Role.ADMIN, Role.KADES, Role.WARGA)
  async getPrintedLettersByResident(
    @Param('residentId') residentId: string,
  ): Promise<{ data: PrintedLetterResponse[] }> {
    const printedLetters =
      await this.printedLetterService.getPrintedLettersByResident(
        parseInt(residentId),
      );
    return { data: printedLetters };
  }

  @Get('download/:letterRequestId')
  @Roles(Role.ADMIN, Role.KADES, Role.WARGA)
  async downloadPrintedLetter(
    @Param('letterRequestId') letterRequestId: string,
    @Res() res: Response,
  ): Promise<void> {
    const buffer = await this.printedLetterService.downloadPrintedLetter(
      parseInt(letterRequestId),
    );

    const letterRequest = await this.prismaService.letterRequest.findUnique({
      where: { id: parseInt(letterRequestId) },
      include: { letterType: true },
    });

    const fileName = `${letterRequest.letterType.name}_${letterRequest.letterNumber}.docx`;

    res.set({
      'Content-Type':
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'Content-Disposition': `attachment; filename="${fileName}"`,
    });

    res.send(buffer);
  }

  @Get('preview/:letterRequestId')
  @Roles(Role.ADMIN, Role.KADES, Role.WARGA)
  async previewLetter(
    @Param('letterRequestId') letterRequestId: string,
    @Res() res: Response,
  ): Promise<void> {
    const buffer = await this.printedLetterService.previewLetter(
      parseInt(letterRequestId),
    );

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="preview-letter-${letterRequestId}.pdf"`,
    });

    res.send(buffer);
  }
}
