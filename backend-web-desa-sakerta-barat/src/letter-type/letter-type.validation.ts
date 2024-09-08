import { z } from 'zod';

export class LetterTypeValidation {
  static readonly CREATE = z.object({
    categoryId: z.number().int().positive(),
    name: z.string().min(1).max(100),
    description: z.string().max(255).optional(),
    requirements: z.string().optional(),
    letterNumberPrefix: z.string().max(10).optional(),
    letterNumberSuffix: z.string().max(10).optional(),
    lastNumberUsed: z.number().int().nonnegative().optional(),
  });
  static readonly UPDATE = LetterTypeValidation.CREATE.partial();
}
