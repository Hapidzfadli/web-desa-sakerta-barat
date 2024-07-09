import { z } from 'zod';
import { ResponseLetterType } from './letter-type.model';
// letter-category.model.ts
export class CreateLetterCategoryRequest {
  name: string;
  description?: string;
}

export class UpdateLetterCategoryRequest {
  name?: string;
  description?: string;
}

export class ResponseLetterCategory {
  id: number;
  name: string;
  description: string | null;
  letterTypes?: ResponseLetterType[];
  createdAt: Date;
  updatedAt: Date;
}

// letter-category.validation.ts

export class LetterCategoryValidation {
  static readonly CREATE = z.object({
    name: z.string().min(1).max(50),
    description: z.string().max(255).optional(),
  });
  static readonly UPDATE = LetterCategoryValidation.CREATE.partial();
}
