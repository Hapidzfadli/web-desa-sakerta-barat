'use client'

import React, { useMemo, useState } from 'react'
import { Bell, ChevronDown, LogOut, Moon, Search, User } from 'lucide-react'
import { useUser } from '../../app/context/UserContext'
import MobileNav from './MobileNav'
import { usePathname, useRouter } from 'next/navigation'
const HeaderDashboard = () => {
  const { user, logout } = useUser()
  const [showDropdown, setShowDropdown] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  const handleLogout = () => {
    logout()
    router.push('/login') 
  }

  const pageTitle = useMemo(() => {
    const routeTitleMap: { [key: string]: string } = {
      '/member/dashboard': 'Dashboard',
      '/member/pengaturan': 'Pengaturan',
      '/member/permohonan': 'Permohonan',
    }

    const matchedRoute = Object.keys(routeTitleMap).find(route => pathname.startsWith(route))
    if (matchedRoute && matchedRoute in routeTitleMap) {
      return routeTitleMap[matchedRoute]
    } else if (pathname.startsWith('/member/pengaturan/')) {
      const subRoute = pathname.split('/').pop()
      return subRoute ? subRoute.charAt(0).toUpperCase() + subRoute.slice(1) : 'Pengaturan'
    } else {
      return 'Halaman'
    }
  }, [pathname])


  return (
    <header className="flex items-center justify-between p-4 bg-white border-b border-gray-200">
      {/* Left section */}
      <div className="flex items-center">
        
        <h1 className="text-2xl font-bold text-black-2 hidden md:block">{pageTitle}</h1>
      </div>

      {/* Center section - Search */}
      <div className="flex-grow max-w-xl mx-4 md:block">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search here..."
            className="w-full pl-10 pr-4 py-2 rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center space-x-4">
        <button className="p-2 rounded-full bg-gray-100 hidden md:block">
          <Moon size={20} />
        </button>
        
        <button className="relative p-2 rounded-full bg-gray-100">
          <Bell size={20} />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        
        <div className="relative">
          <button 
            className="flex items-center space-x-2"
            onMouseEnter={() => setShowDropdown(true)}
            onMouseLeave={() => setShowDropdown(false)}
          >
            <div className="p-2 rounded-full bg-gray-100">
              <User size={20} />
            </div>
          </button>
          
          {showDropdown && (
            <div 
              className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10"
              onMouseEnter={() => setShowDropdown(true)}
              onMouseLeave={() => setShowDropdown(false)}
            >
              <p className="px-4 py-2 text-sm text-gray-700">{user?.username}</p>
              <p className="px-4 py-2 text-sm text-gray-500">{user?.role}</p>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center"
              >
                <LogOut size={16} className="mr-2" />
                Keluar
              </button>
            </div>
          )}
        </div>
        <div className="md:hidden mr-4">
          <MobileNav />
        </div>
      </div>
    </header>
  )
}

export default HeaderDashboard