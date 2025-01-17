'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { Info, LogOut, Search } from 'lucide-react';
import { useUser } from '../../app/context/UserContext';
import MobileNav from './MobileNav';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '../ui/button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import { getAvatar } from '../../lib/actions/setting.actions';
import NotificationComponent from './NotificationComponent';
const HeaderDashboard = () => {
  const { user, logout } = useUser();
  const [showDropdown, setShowDropdown] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const [avatarUrl, setAvatarUrl] = useState<string>('');

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  useEffect(() => {
    const fetchAvatar = async () => {
      if (user?.profilePicture) {
        const url = await getAvatar(user.profilePicture);
        setAvatarUrl(url);
      }
    };
    fetchAvatar();
  }, [user?.profilePicture]);

  const pageTitle = useMemo(() => {
    const routeTitleMap: { [key: string]: string } = {
      '/member/dashboard': 'Dashboard',
      '/member/pengaturan': 'Pengaturan',
      '/member/permohonan': 'Ajukan',
      '/member/daftar-permohonan': 'Permohonan',
      '/member/panduan-aplikasi': 'Panduan',
      '/admin/panduan-aplikasi': 'Panduan',
      '/admin/dashboard': 'Dashboard',
      '/admin/daftar-surat': 'Daftar Surat',
      '/admin/pengaturan': 'Pengaturan',
      '/admin/daftar-permohonan': 'Permohonan',
      '/admin/daftar-pengguna': 'Pengguna',
    };

    const matchedRoute = Object.keys(routeTitleMap).find((route) =>
      pathname.startsWith(route),
    );
    if (matchedRoute && matchedRoute in routeTitleMap) {
      return routeTitleMap[matchedRoute];
    } else if (pathname.startsWith('/member/pengaturan/')) {
      const subRoute = pathname.split('/').pop();
      return subRoute
        ? subRoute.charAt(0).toUpperCase() + subRoute.slice(1)
        : 'Pengaturan';
    } else {
      return 'Halaman';
    }
  }, [pathname]);

  return (
    <header className="flex items-center justify-between p-4 bg-white border-b border-gray-200">
      {/* Left section */}
      <div className="flex items-center">
        <div className="md:hidden">
          <MobileNav />
        </div>
        <h1 className="text-2xl ml-6 font-bold text-[#2B3674] hidden md:block">
          {pageTitle}
        </h1>
      </div>

      {/* Center section - Search */}
      <div className="flex-grow max-w-xl mx-4 md:block">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8F9BBA]" />
          <input
            type="text"
            placeholder="Cari disini..."
            className="w-full pl-10 pr-4 py-2 rounded-full text-[#8F9BBA] bg-[#F4F7FE] focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center space-x-2">
        {/* Search icon for mobile */}
        <Button
          className="md:block bg-white h-8 w-8 rounded-full p-0 hidden"
          title="Search"
          onClick={() => {
            /* Implement mobile search functionality */
          }}
        >
          <Search className="h-4 w-4 text-[#A3AED0]" />
        </Button>

        {/* Notification component */}
        <NotificationComponent />

        {/* User avatar */}
        <Button
          className="bg-white h-8 w-8 rounded-full p-0 md:block hidden"
          title="Profile"
          onClick={() => {
            /* Implement profile action */
          }}
        >
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={avatarUrl || 'https://avatar.iran.liara.run/public'}
              alt={user?.username || 'User Avatar'}
            />
            <AvatarFallback>{user?.username?.[0] || 'U'}</AvatarFallback>
          </Avatar>
        </Button>

        {/* Mobile Nav */}
      </div>
    </header>
  );
};

export default HeaderDashboard;
