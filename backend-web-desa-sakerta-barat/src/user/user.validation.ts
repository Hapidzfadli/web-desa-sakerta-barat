import { z, ZodType } from 'zod';

const phoneRegex = /^(08|02)\d{8,12}$/;

export const phoneSchema = z
  .string()
  .regex(
    phoneRegex,
    'Nomor telepon harus diawali dengan 08 atau 02 dan diikuti oleh 8-12 digit',
  )
  .min(10, 'Nomor telepon minimal 10 digit')
  .max(14, 'Nomor telepon maksimal 14 digit')
  .optional();
export class UserValidation {
  static readonly REGISTER: ZodType = z.object({
    username: z
      .string()
      .min(3, 'Username harus minimal 3 karakter')
      .max(50, 'Username maksimal 50 karakter')
      .regex(
        /^[a-zA-Z0-9_]+$/,
        'Username hanya boleh berisi huruf, angka, dan underscore',
      ),
    password: z
      .string()
      .min(8, 'Password harus minimal 8 karakter')
      .max(100, 'Password maksimal 100 karakter')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        'Password harus mengandung minimal satu huruf besar, satu huruf kecil, satu angka, dan satu karakter khusus',
      ),
    name: z
      .string()
      .min(1, 'Nama tidak boleh kosong')
      .max(100, 'Nama maksimal 100 karakter'),
    email: z
      .string()
      .email('Format email tidak valid')
      .max(100, 'Email maksimal 100 karakter'),
    firstName: z
      .string()
      .min(1, 'Nama depan tidak boleh kosong')
      .max(50, 'Nama depan maksimal 50 karakter'),
    lastName: z
      .string()
      .max(50, 'Nama belakang maksimal 50 karakter')
      .optional(),
  });

  static readonly LOGIN: ZodType = z.object({
    username: z
      .string()
      .min(3, 'Username harus minimal 3 karakter')
      .max(50, 'Username maksimal 50 karakter'),
    password: z
      .string()
      .min(8, 'Password harus minimal 8 karakter')
      .max(100, 'Password maksimal 100 karakter'),
  });

  static readonly UPDATE: ZodType = z.object({
    name: z
      .string()
      .min(1, 'Nama tidak boleh kosong')
      .max(100, 'Nama maksimal 100 karakter')
      .optional(),
    password: z
      .string()
      .min(8, 'Password harus minimal 8 karakter')
      .max(100, 'Password maksimal 100 karakter')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        'Password harus mengandung minimal satu huruf besar, satu huruf kecil, satu angka, dan satu karakter khusus',
      )
      .optional(),
    email: z
      .string()
      .email('Format email tidak valid')
      .max(100, 'Email maksimal 100 karakter')
      .optional(),
    isVerified: z.boolean().optional(),
    phoneNumber: phoneSchema,
    profilePicture: z
      .string()
      .url('Format URL tidak valid')
      .max(255, 'URL foto profil maksimal 255 karakter')
      .optional()
      .refine(
        (url) => {
          if (!url) return true; // Allow empty values
          const validExtensions = ['.jpg', '.jpeg', '.png', '.gif'];
          return validExtensions.some((ext) => url.toLowerCase().endsWith(ext));
        },
        {
          message:
            'URL foto profil harus berakhiran .jpg, .jpeg, .png, atau .gif',
        },
      ),
  });

  static readonly CHANGE_PASSWORD: ZodType = z.object({
    oldPassword: z.string().min(1, 'Old password is required'),
    newPassword: z
      .string()
      .min(8, 'Password harus minimal 8 karakter')
      .max(100, 'Password maksimal 100 karakter')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        'Password harus mengandung minimal satu huruf besar, satu huruf kecil, satu angka, dan satu karakter khusus',
      ),
  });

  static readonly UPDATE_KADES_PIN: ZodType = z.object({
    pin: z
      .string()
      .length(6, 'PIN harus terdiri dari 6 digit')
      .regex(/^\d+$/, 'PIN harus berupa angka'),
  });
}
