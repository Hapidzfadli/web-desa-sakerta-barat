import { z } from 'zod';
enum DocumentType {
  ID_CARD = 'ID_CARD',
  DRIVING_LICENSE = 'DRIVING_LICENSE',
  FAMILY_CARD = 'FAMILY_CARD',
}

enum MaritalStatus {
  BELUM_KAWIN = 'BELUM',
  KAWIN = 'KAWIN',
  JANDA = 'JANDA',
  DUDA = 'DUDA',
}

enum Gender {
  LAKI_LAKI = 'LAKI_LAKI',
  PEREMPUAN = 'PEREMPUAN',
}

export enum RequestStatus {
  SUBMITTED = 'SUBMITTED',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  SIGNED = 'SIGNED',
  COMPLETED = 'COMPLETED',
  ARCHIVED = 'ARCHIVED',
}
export const applicationValidationSchema = z.object({
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
  gender: z.nativeEnum(Gender).optional(),
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
  rt: z.union([z.string(), z.number()]).transform(Number).optional(),
  rw: z.union([z.string(), z.number()]).transform(Number).optional(),
  notes: z.string().optional(),
  newAttachments: z.any().optional(),
});

export const verifyLetterRequestSchema = z.object({
  status: z.enum([
    RequestStatus.COMPLETED,
    RequestStatus.REJECTED,
    RequestStatus.APPROVED,
  ]),
  notes: z.string().optional(),
});

export const translateStatus = (status: string): string => {
  const statusMap: { [key: string]: string } = {
    SUBMITTED: 'Diajukan',
    APPROVED: 'Disetujui',
    REJECTED: 'Ditolak',
    SIGNED: 'Ditandatangani',
    COMPLETED: 'Selesai',
    ARCHIVED: 'Diarsipkan',
  };
  return statusMap[status] || status;
};
