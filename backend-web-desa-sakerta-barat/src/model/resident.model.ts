import { DocumentType } from '@prisma/client';

export class CreateResidentRequest {
  nationalId: string;
  name: string;
  dateOfBirth: Date;
  idCardAddress: string;
  residentialAddress: string;
  documentType?: DocumentType;
}

export class UpdateResidentRequest {
  nationalId?: string;
  name?: string;
  dateOfBirth?: Date;
  idCardAddress?: string;
  residentialAddress?: string;
  documentType?: DocumentType;
}

export class ResidentResponse {
  id: number;
  nationalId: string;
  name: string;
  dateOfBirth: Date;
  idCardAddress: string;
  residentialAddress: string;
  documents: DocumentResponse[];
}

export class DocumentResponse {
  id: number;
  type: DocumentType;
  fileUrl: string;
}
