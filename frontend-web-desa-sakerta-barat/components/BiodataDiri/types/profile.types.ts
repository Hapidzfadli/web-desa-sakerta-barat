export interface ProfileData {
  username: string;
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  phoneNumber: string;
  isVerified: boolean;
  role: string;
  updatedAt: string;
  profilePicture?: string;
  avatarUrl?: string;
  resident: ResidentData;
}

export interface ResidentData {
  name: string;
  nationalId: string;
  dateOfBirth: string;
  religion: string;
  maritalStatus: string;
  occupation: string;
  nationality: string;
  placeOfBirth: string;
  gender: string;
  familyCardNumber: string;
  district: string;
  regency: string;
  province: string;
  postalCode: string;
  rt: number;
  rw: number;
  idCardAddress: string;
  residentialAddress: string;
  documents: Document[];
}

export interface Document {
  id: number;
  type: DocumentType;
  fileName: string;
}
export enum DocumentType {
  ID_CARD = 'ID_CARD',
  DRIVING_LICENSE = 'DRIVING_LICENSE',
  FAMILY_CARD = 'FAMILY_CARD',
}
