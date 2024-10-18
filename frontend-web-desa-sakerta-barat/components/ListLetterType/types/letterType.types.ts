export interface LetterType {
  id: number;
  name: string;
  description: string;
  icon?: string;
  requirements: string;
  categoryId: number;
  letterNumberPrefix?: string;
  letterNumberSuffix?: string;
  lastNumberUsed?: number;
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
  rt: string;
  rw: string;
  idCardAddress: string;
  residentialAddress: string;
  documents: Document[];
}

export interface Document {
  id: number;
  type: string;
  fileName: string;
}
