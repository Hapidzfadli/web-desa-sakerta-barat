import { z } from 'zod';

export class PrintedLetterValidation {
  static readonly CREATE = z.object({
    letterRequestId: z.number().int().positive(),
    printedBy: z.number().int().positive(),
    fileUrl: z.string().url().optional(),
  });

  static readonly UPDATE = z.object({
    archivedAt: z.date().optional(),
    archivedBy: z.number().int().positive().optional(),
    notificationSent: z.boolean().optional(),
    notificationSentAt: z.date().optional(),
  });
}
