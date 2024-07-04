import { DocumentType, MaritalStatus } from '@prisma/client';

export class CreateResidentRequest {
  nationalId: string;
  name: string;
  dateOfBirth: Date;
  idCardAddress: string;
  residentialAddress: string;
  documentType?: DocumentType;
  religion?: string;
  maritalStatus?: MaritalStatus;
  occupation?: string;
  nationality?: string;
  placeOfBirth?: string;
  gender?: 'LAKI_LAKI' | 'PEREMPUAN';
  familyCardNumber?: string;
  district?: string;
  regency?: string;
  province?: string;
  postalCode?: string;
}

export class UpdateResidentRequest {
  nationalId?: string;
  name?: string;
  dateOfBirth?: Date;
  idCardAddress?: string;
  residentialAddress?: string;
  documentType?: DocumentType;
  religion?: string;
  maritalStatus?: MaritalStatus;
  occupation?: string;
  nationality?: string;
  placeOfBirth?: string;
  gender?: 'LAKI_LAKI' | 'PEREMPUAN';
  familyCardNumber?: string;
  district?: string;
  regency?: string;
  province?: string;
  postalCode?: string;
}

export class ResidentResponse {
  id: number;
  nationalId: string;
  name: string;
  dateOfBirth: Date;
  idCardAddress: string;
  residentialAddress: string;
  religion?: string;
  maritalStatus?: MaritalStatus;
  occupation?: string;
  nationality?: string;
  placeOfBirth?: string;
  gender?: 'LAKI_LAKI' | 'PEREMPUAN';
  familyCardNumber?: string;
  district?: string;
  regency?: string;
  province?: string;
  postalCode?: string;
  documents: DocumentResponse[];
}

export class DocumentResponse {
  id: number;
  type: DocumentType;
  fileUrl: string;
}
