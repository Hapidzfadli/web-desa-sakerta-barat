import { RequestStatus, Resident } from '@prisma/client';
import { ResidentResponse } from './resident.model';

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
  approvedLetterPath?: string;
  signedLetterPath?: string;
}

export class VerifyLetterRequestDto {
  status: Extract<RequestStatus, 'APPROVED' | 'REJECTED'>;
  notes?: string;
  rejectionReason?: string;
}
export class SignLetterRequestDto {
  status: Extract<RequestStatus, 'SIGNED' | 'REJECTED_BY_KADES'>;
  notes?: string;
  rejectionReason?: string;
  pin: string;
}

export class AttachmentDto {
  fileName: string;
  fileUrl?: string;
  documentId?: number;
}

export class ResponseLetterRequest {
  id: number;
  residentId: number;
  residentName?: string;
  letterName?: string;
  letterTypeId: number;
  letterNumber?: string;
  requestDate: Date;
  status: RequestStatus;
  notes?: string;
  rejectionReason?: string;
  attachments: AttachmentDto[];
  resident?: ResidentResponse;
  approvedLetterPath?: string;
  signedLetterPath?: string;
  createdAt: Date;
  updatedAt: Date;
}
