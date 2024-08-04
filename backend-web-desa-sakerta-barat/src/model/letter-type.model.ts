export class CreateLetterTypeRequest {
  categoryId: number;
  name: string;
  description?: string;
  requirements?: string;
  template: string;
}

export class UpdateLetterTypeRequest {
  categoryId?: number;
  name?: string;
  description?: string;
  requirements?: string;
  template?: string;
}

export class ResponseLetterType {
  id: number;
  categoryId: number;
  name: string;
  description: string | null;
  requirements: string | null;
  icon: string | null;
  template: string;
  createdAt: Date;
  updatedAt: Date;
}
