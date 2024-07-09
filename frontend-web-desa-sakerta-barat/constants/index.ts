import { Home, FilePlus, FileCheck, Settings, LogOut } from 'lucide-react';
export const headerLinks = [
  {
    route: '/',
    label: 'Home',
  },
  {
    route: '/profil',
    label: 'Profil Desa',
  },
  {
    route: '/berita',
    label: 'Berita',
  },
  {
    route: '/infografis',
    label: 'Infografis',
  },
];
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
    icon: Home,
    route: '/member/dashboard',
    label: 'Dashboard',
  },
  {
    icon: FilePlus,
    route: '/member/permohonan',
    label: 'Ajukan Permohonan',
  },
  {
    icon: FileCheck,
    route: '/member/status',
    label: 'Status Permohonan',
  },
  {
    icon: Settings,
    route: '/member/pengaturan',
    label: 'Pengaturan',
  },
];
export const sidebarLinksAdmin = [
  {
    icon: Home,
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
