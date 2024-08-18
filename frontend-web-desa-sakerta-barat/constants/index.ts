import { Home, FilePlus, FileCheck, Settings, LogOut } from 'lucide-react';
import { TiInfoLarge } from 'react-icons/ti';
import { LuFilePlus2 } from 'react-icons/lu';
import { IoHomeOutline } from 'react-icons/io5';
// export const headerLinks = [
//   {
//     route: '/',
//     label: 'Home',
//   },
//   {
//     route: '/profil',
//     label: 'Profil Desa',
//   },
//   {
//     route: '/berita',
//     label: 'Berita',
//   },
//   {
//     route: '/infografis',
//     label: 'Infografis',
//   },
// ];
export const sidebarLinks = [
  {
    imgURL: '/assets/icons/home.svg',
    route: '/member/dashboard',
    label: 'Dashboard',
  },
  {
    imgURL: '/assets/icons/group.png',
    route: '/kependudukan',
    label: 'Kependudukan',
  },
  {
    imgURL: '/assets/icons/wedding.png',
    route: '/pernikahan',
    label: 'Pernikahan',
  },
  {
    imgURL: '/assets/icons/location.png',
    route: '/Pertanahan',
    label: 'Pertanahan',
  },
];
export const sidebarLinksMember = [
  {
    icon: IoHomeOutline,
    route: '/member/dashboard',
    label: 'Dashboard',
  },
  {
    icon: LuFilePlus2,
    route: '/member/permohonan',
    label: 'Ajukan Permohonan',
  },
  {
    icon: FileCheck,
    route: '/member/daftar-permohonan',
    label: 'Daftar Permohonan',
  },
  {
    icon: TiInfoLarge,
    route: '/member/panduan-aplikasi',
    label: 'Panduan Aplikasi',
  },
  {
    icon: Settings,
    route: '/member/pengaturan',
    label: 'Pengaturan',
  },
];
export const sidebarLinksAdmin = [
  {
    icon: IoHomeOutline,
    route: '/admin/dashboard',
    label: 'Dashboard',
  },
  {
    icon: FilePlus,
    route: '/admin/daftar-surat',
    label: 'Daftar Surat',
  },
  {
    icon: FileCheck,
    route: '/admin/daftar-permohonan',
    label: 'Daftar Permohonan',
  },
  {
    icon: TiInfoLarge,
    route: '/admin/panduan-aplikasi',
    label: 'Panduan Aplikasi',
  },
  {
    icon: Settings,
    route: '/admin/pengaturan',
    label: 'Pengaturan',
  },
];
export const exploreLink = [
  {
    route: '/berita',
    label: 'Berita Desa',
    icon: '/assets/icons/newspaper.png',
  },
  {
    route: '/infografis',
    label: 'Infografis',
    icon: '/assets/icons/report.png',
  },
  {
    route: '/infografis/apbdes',
    label: 'APBDes',
    icon: '/assets/icons/bookeeping.png',
  },
  {
    route: '/infografis/bonsos',
    label: 'Bansos',
    icon: '/assets/icons/charity.png',
  },
];

export const API_URL = process.env.NEXT_PUBLIC_API_URL;
