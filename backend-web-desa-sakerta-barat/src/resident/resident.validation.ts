import { z } from 'zod';
import { DocumentType, MaritalStatus } from '@prisma/client';

export class ResidentValidation {
  static readonly CREATE = z.object({
    nationalId: z.string().length(16, 'National ID must be 16 characters'),
    name: z
      .string()
      .min(1, 'Name is required')
      .max(100, 'Name must not exceed 100 characters'),
    dateOfBirth: z.coerce.date(),
    idCardAddress: z
      .string()
      .min(1, 'ID Card Address is required')
      .max(255, 'ID Card Address must not exceed 255 characters'),
    residentialAddress: z
      .string()
      .min(1, 'Residential Address is required')
      .max(255, 'Residential Address must not exceed 255 characters'),
    userId: z.number().int().positive(),
    documentType: z.nativeEnum(DocumentType).optional(),
    religion: z
      .string()
      .max(50, 'Religion must not exceed 50 characters')
      .optional(),
    maritalStatus: z.nativeEnum(MaritalStatus).optional(),
    occupation: z
      .string()
      .max(50, 'Occupation must not exceed 50 characters')
      .optional(),
    nationality: z
      .string()
      .max(50, 'Nationality must not exceed 50 characters')
      .optional(),
    placeOfBirth: z
      .string()
      .max(100, 'Place of Birth must not exceed 100 characters')
      .optional(),
    gender: z.enum(['LAKI_LAKI', 'PEREMPUAN']).optional(),
    familyCardNumber: z
      .string()
      .max(20, 'Family Card Number must not exceed 20 characters')
      .optional(),
    district: z
      .string()
      .max(50, 'District must not exceed 50 characters')
      .optional(),
    regency: z
      .string()
      .max(50, 'Regency must not exceed 50 characters')
      .optional(),
    province: z
      .string()
      .max(50, 'Province must not exceed 50 characters')
      .optional(),
    postalCode: z
      .string()
      .max(10, 'Postal Code must not exceed 10 characters')
      .optional(),
  });

  static readonly UPDATE = ResidentValidation.CREATE.partial().omit({
    userId: true,
  });
}
