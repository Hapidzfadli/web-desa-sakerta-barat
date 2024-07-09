'use client';

import React, { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { sidebarLinks, sidebarLinksMember } from '@/constants';
import { useUser } from '../../app/context/UserContext';
import { ChevronLeft, ChevronRight, LogOut } from 'lucide-react';

const Sidebar = ({ sidebar }: SidebarProps) => {
  const pathname = usePathname();
  const { user, logout } = useUser();
  const [isExpanded, setIsExpanded] = useState(true);
  const router = useRouter();

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };
  return (
    <div className="relative">
      <section
        className={cn(
          'sidebar transition-all duration-300 h-screen',
          isExpanded ? 'w-64' : 'w-20'
        )}
      >
        <nav className="flex flex-col gap-2 h-full p-4">
          <Link
            href="/"
            className="mb-4 cursor-pointer flex justify-center items-center"
          >
            <div className="relative w-8 h-8 sm:w-12 sm:h-12 md:w-16 md:h-16">
              <Image
                src="/assets/images/logo.svg"
                layout="fill"
                objectFit="cover"
                alt="Sakerta Barat"
              />
            </div>
          </Link>
          {sidebar.map((item) => {
            const isActive =
              pathname === item.route || pathname.startsWith(`${item.route}/`);
            const Icon = item.icon;
            return (
              <Link
                href={item.route}
                key={item.label}
                className={cn(
                  'sidebar-link flex items-center rounded-lg p-2 transition-all',
                  { 'bg-bank-gradient text-white': isActive },
                  isExpanded ? 'justify-start' : 'justify-center'
                )}
              >
                <Icon
                  className={cn('h-6 w-6 text-gray-600', {
                    'text-white': isActive,
                  })}
                />
                {isExpanded && (
                  <p
                    className={cn(
                      'sidebar-label ml-3 transition-opacity duration-300 w-fit whitespace-nowrap',
                      isActive ? 'text-white font-semibold' : 'text-black-2'
                    )}
                  >
                    {item.label}
                  </p>
                )}
              </Link>
            );
          })}
          <button
            onClick={handleLogout}
            className={cn(
              'sidebar-link flex items-center rounded-lg p-2 transition-all mt-auto',
              isExpanded ? 'justify-start' : 'justify-center'
            )}
          >
            <LogOut className="h-6 w-6 text-gray-600" />
            {isExpanded && (
              <p className="sidebar-label ml-3 transition-opacity duration-300 w-fit whitespace-nowrap text-gray-600">
                Keluar
              </p>
            )}
          </button>
        </nav>
      </section>
      <button
        onClick={toggleSidebar}
        className={cn(
          'absolute top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md transition-all duration-300',
          isExpanded ? '-right-4' : '-right-1 translate-x-full'
        )}
      >
        {isExpanded ? <ChevronLeft size={24} /> : <ChevronRight size={24} />}
      </button>
    </div>
  );
};

export default Sidebar;
