import { User, LetterRequest } from '@prisma/client';

export class PrintedLetterDto {
  id: number;
  letterRequestId: number;
  printedAt: Date;
  printedBy: number;
  archivedAt?: Date | null;
  archivedBy?: number | null;
  notificationSentAt?: Date | null;
  fileUrl?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export class CreatePrintedLetterDto {
  letterRequestId: number;
  printedAt: Date;
  printedBy: number;
  fileUrl?: string | null;
}

export class UpdatePrintedLetterDto {
  archivedAt?: Date | null;
  archivedBy?: number | null;
  notificationSent?: boolean;
  notificationSentAt?: Date | null;
}

export class PrintedLetterResponse extends PrintedLetterDto {
  letterRequest?: LetterRequest;
  printedByUser?: User;
  archivedByUser?: User;
}
