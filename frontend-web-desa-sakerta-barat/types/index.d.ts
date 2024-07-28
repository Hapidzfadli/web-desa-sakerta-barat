declare type User = {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
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
