export class CreateLetterTypeRequest {
  categoryId: number;
  name: string;
  description?: string;
  requirements?: string;
  template: string;
  letterNumberPrefix?: string;
  letterNumberSuffix?: string;
  lastNumberUsed?: number;
}

export class UpdateLetterTypeRequest {
  categoryId?: number;
  name?: string;
  description?: string;
  requirements?: string;
  template?: string;
  letterNumberPrefix?: string;
  letterNumberSuffix?: string;
  lastNumberUsed?: number;
}

export class ResponseLetterType {
  id: number;
  categoryId: number;
  name: string;
  description: string | null;
  requirements: string | null;
  icon: string | null;
  template: string;
  letterNumberPrefix: string | null;
  letterNumberSuffix: string | null;
  lastNumberUsed: number | null;
  createdAt: Date;
  updatedAt: Date;
}
