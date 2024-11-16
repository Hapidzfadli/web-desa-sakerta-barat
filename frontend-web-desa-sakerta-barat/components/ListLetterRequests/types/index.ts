export interface Resident {
  id: number;
  name: string;
  nationalId: string;
  dateOfBirth: string;
  idCardAddress: string;
  residentialAddress: string;
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
  fatherName: string;
  motherName: string;
  rt: string;
  rw: string;
  bloodType: string;
}

export interface Attachment {
  id: number;
  fileName: string;
  fileUrl: string;
}

export interface LetterRequest {
  id: number;
  residentName: string;
  letterName: string;
  requestDate: string;
  status: string;
  notes: string;
  rejectionReason?: string;
  resident: Resident;
  attachments: Attachment[];
}

export interface TableColumn {
  header: string;
  accessor: string | ((row: LetterRequest) => React.ReactNode);
  className?: string;
  cell?: (value: any) => React.ReactNode;
  disableSorting?: boolean;
}

export interface PaginationInfo {
  total: number;
  perPage: number;
  currentPage: number;
  lastPage: number;
}

export interface LetterRequestsResponse {
  data: LetterRequest[];
  paging: PaginationInfo;
}
