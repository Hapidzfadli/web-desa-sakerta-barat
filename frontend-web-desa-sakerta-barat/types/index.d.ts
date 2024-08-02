declare type User = {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  profilePicture?: string;
};

declare type BiodataType = {
  nama: string;
  nik: string;
  nokk: string;
  tempatLahir: string;
  tanggalLahir: string;
  jenisKelamin: string;
  alamat: string;
  rt: string;
  rw: string;
  kelurahanDesa: string;
  kecamatan: string;
  agama: string;
  statusPerkawinan: string;
  pekerjaan: string;
  kewarganegaraan: string;
  berlakuHingga: string;
};

declare interface UserContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  logout: () => void;
}

declare interface ExploreProps {
  title: string;
  description: string;
}

declare interface SiderbarProps {
  user: User;
}

declare interface LoginProps {
  username: string;
  password: string;
}

declare interface DecodedToken {
  sub: number;
  userId: number;
  username: string;
}

declare interface SidebarItem {
  icon: React.ElementType;
  route: string;
  label: string;
}

declare interface SidebarProps {
  sidebar: SidebarItem[];
}

declare interface LetterCategoryProps {
  id: number;
  name: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
}
declare interface LetterTypeProps {
  id: number;
  categoryId: number;
  name: string;
  description: string | null;
  requirements: string | null;
  icon: string | null;
  template: string | null;
  createdAt: Date;
  updatedAt: Date;
}

declare interface Tab {
  id: number;
  label: string;
  component: React.ReactNode;
}

declare interface ListLetterProps {
  categoryId: number;
}

declare interface LetterTypeFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData?: any;
}

declare interface OptionsProps {
  filter?: Record<string, any>;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
}
// ========================================

declare type RegisterParams = {
  firstName: string;
  lastName: string;
  username: string;
  name: string;
  email: string;
  password: string;
};

declare interface profileData {
  username?: string;
  name?: string;
  email?: string;
  role?: Role;
  token?: string;
  isVerified?: boolean;
  phoneNumber?: string;
  profilePicture?: string;
}

declare interface Column<T> {
  header: string;
  accessor: keyof T | ((data: T) => React.ReactNode);
  cell?: (value: any, row: T) => React.ReactNode;
  className?: string;
}

declare interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  itemsPerPageOptions?: number[];
  onSearch?: (query: string) => void;
  onFilter?: () => void;
  searchPlaceholder?: string;
}

declare interface LetterRequest {
  id: number;
  residentId: number;
  residentName: string;
  letterName: string;
  letterTypeId: number;
  letterNumber: string | null;
  requestDate: string;
  status: string;
  notes: string;
  attachments: {
    fileName: string;
    fileUrl: string;
    documentId: number | null;
  }[];
  createdAt: string;
  updatedAt: string;
  resident: Resident;
}

declare interface Resident {
  id: number;
  nationalId: string;
  name: string;
  dateOfBirth: string;
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
  rt?: number;
  rw?: number;
  bloodType?: BloodType;
  documents?: Document[];
}

declare interface Document {
  id: number;
  type: DocumentType;
  fileUrl: string;
}
declare interface PaginationInfo {
  size: number;
  total_page: number;
  current_page: number;
  total: number;
}

declare interface LetterRequestsResponse {
  data: LetterRequest[];
  paging: PaginationInfo;
}

declare enum DocumentTipe {
  ID_CARD = 'ID_CARD',
  DRIVING_LICENSE = 'DRIVING_LICENSE',
  FAMILY_CARD = 'FAMILY_CARD',
}

declare enum MaritalStatus {
  BELUM_KAWIN = 'BELUM',
  KAWIN = 'KAWIN',
  JANDA = 'JANDA',
  DUDA = 'DUDA',
}

declare enum Gender {
  LAKI_LAKI = 'LAKI_LAKI',
  PEREMPUAN = 'PEREMPUAN',
}

declare enum RequestStatus {
  SUBMITTED = 'SUBMITTED',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  REJECTED = 'REJECTED',
}

declare enum BloodType {
  A = 'A',
  B = 'B',
  AB = 'AB',
  O = 'O',
}
