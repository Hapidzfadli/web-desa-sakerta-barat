import { z, ZodType } from 'zod';

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
  });
}
