import { z } from 'zod';
import { RequestStatus } from '@prisma/client';

export class LetterRequestValidation {
  static readonly CREATE = z.object({
    letterTypeId: z.number().int().positive(),
    notes: z.string().optional(),
    additionalResidents: z.record(z.string()).optional(),
    attachments: z
      .array(
        z.object({
          fileName: z.string(),
          fileUrl: z.string().optional(),
          documentId: z.number().int().positive().optional(),
        }),
      )
      .optional(),
  });

  static readonly UPDATE = z.object({
    notes: z.string().optional(),
    additionalResidents: z.record(z.string()).optional(),
    attachments: z
      .array(
        z.object({
          fileName: z.string(),
          fileUrl: z.string().optional(),
          documentId: z.number().int().positive().optional(),
        }),
      )
      .optional(),
  });

  static readonly VERIFY = z.object({
    status: z.enum([RequestStatus.APPROVED, RequestStatus.REJECTED]),
    notes: z.string().optional(),
    rejectionReason: z.string().optional().nullable(),
  });

  static readonly SIGN = z.object({
    status: z.enum([RequestStatus.SIGNED, RequestStatus.REJECTED_BY_KADES]),
    notes: z.string().optional(),
    rejectionReason: z.string().optional().nullable(),
  });
}
