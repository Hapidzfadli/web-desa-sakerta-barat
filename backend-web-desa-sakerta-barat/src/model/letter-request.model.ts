import { RequestStatus } from '@prisma/client';

export class CreateLetterRequestDto {
  letterTypeId: number;
  notes?: string;
  attachments?: {
    fileName: string;
    fileUrl?: string;
    documentId?: number;
  }[];
}

export class UpdateLetterRequestDto {
  notes?: string;
  attachments?: AttachmentDto[];
}

export class VerifyLetterRequestDto {
  status: Extract<RequestStatus, 'APPROVED' | 'REJECTED'>;
  notes?: string;
}

export class AttachmentDto {
  fileName: string;
  fileUrl?: string;
  documentId?: number;
}

export class ResponseLetterRequest {
  id: number;
  residentId: number;
  letterTypeId: number;
  letterNumber?: string;
  requestDate: Date;
  status: RequestStatus;
  notes?: string;
  attachments: AttachmentDto[];
  createdAt: Date;
  updatedAt: Date;
}
