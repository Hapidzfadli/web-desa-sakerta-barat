import { z } from 'zod';

// Define enums (assuming these are defined elsewhere in your project)
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

export const createLetterCategorySchema = z.object({
  name: z.string().min(1).max(50),
  description: z.string().max(255).optional(),
});
export const updateLetterCategorySchema = createLetterCategorySchema.partial();

export const createLetterTypeSchema = z.object({
  categoryId: z.number().int().positive(),
  name: z.string().min(1).max(100),
  description: z.string().max(255).optional(),
  requirements: z.string().optional(),
});

export const updateLetterTypeSchema = createLetterTypeSchema.partial();

export const createLetterRequestSchema = z.object({
  letterTypeId: z.number().int().positive(),
  notes: z.string().optional(),
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

export const updateLetterRequestSchema = createLetterRequestSchema.partial();

export const addDocumentSchema = z.object({
  type: z.nativeEnum(DocumentType),
  file: z.instanceof(File).refine((file) => file.size <= 5000000, {
    message: 'File size should be less than 5MB',
  }),
});
