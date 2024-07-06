import { z } from 'zod';

export class LetterCategoryValidation {
  static readonly CREATE = z.object({
    name: z.string().max(20),
    description: z.string().max(255).optional(),
  });
  static readonly UPDATE = LetterCategoryValidation.CREATE.partial();
}
