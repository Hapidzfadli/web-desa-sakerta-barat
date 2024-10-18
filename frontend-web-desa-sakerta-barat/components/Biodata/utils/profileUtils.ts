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
export const updateProfileSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  name: z.string().optional(),
  email: z.string().email().max(50).optional(),
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters long')
    .optional(),
  phoneNumber: z.string().optional(), // Changed to string as phone numbers are typically handled as strings
});

export const createResidentSchema = z.object({
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
});

export const updateResidentSchema = createResidentSchema.partial().omit({
  userId: true,
});

// You can also export types derived from these schemas if needed
export type UpdateProfileData = z.infer<typeof updateProfileSchema>;
export type CreateResidentData = z.infer<typeof createResidentSchema>;
export type UpdateResidentData = z.infer<typeof updateResidentSchema>;

export const addDocumentSchema = z.object({
  type: z.string().min(1, 'Tipe dokumen harus dipilih'),
  file: z.instanceof(File, { message: 'File harus diunggah' }),
});

export const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const toInputDateValue = (
  dateString: string | null | undefined,
): string => {
  if (!dateString) return '';
  const date = new Date(dateString);

  if (isNaN(date.getTime())) {
    console.warn(`Invalid date string: ${dateString}`);
    return '';
  }
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};
