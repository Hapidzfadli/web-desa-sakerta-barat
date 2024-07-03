declare type User = {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

declare type BiodataType = {
  nama: string
  nik: string
  nokk: string
  tempatLahir: string
  tanggalLahir: string
  jenisKelamin: string
  alamat: string
  rt: string
  rw: string
  kelurahanDesa: string
  kecamatan: string
  agama: string
  statusPerkawinan: string
  pekerjaan: string
  kewarganegaraan: string
  berlakuHingga: string
}

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
  sub : number,
  userId: number,
  username :string,
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