import { z } from 'zod';
import { DocumentType } from '@prisma/client';

export class ResidentValidation {
  static readonly CREATE = z.object({
    nationalId: z.string().length(16, 'National ID must be 16 characters'),
    name: z
      .string()
      .min(1, 'Name is required')
      .max(100, 'Name must not exceed 100 characters'),
    dateOfBirth: z.coerce.date(),
    idCardAddress: z.string().min(1, 'ID Card Address is required'),
    residentialAddress: z.string().min(1, 'Residential Address is required'),
    userId: z.number().int().positive(),
    documentType: z.nativeEnum(DocumentType).optional(),
  });

  static readonly UPDATE = ResidentValidation.CREATE.partial().omit({
    userId: true,
  });
}
