import React, { useEffect, useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Menu, LogOut } from 'lucide-react';
import { Separator } from '../ui/separator';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useUser } from '../../app/context/UserContext';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import { sidebarLinksMember, sidebarLinksAdmin } from '@/constants';
import { getAvatar } from '../../lib/actions/setting.actions';

type SidebarItem = {
  icon: React.ElementType;
  route: string;
  label: string;
};

interface MobileNavProps {
  sidebar?: SidebarItem[];
}

const MobileNav: React.FC<MobileNavProps> = ({ sidebar }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useUser();
  const [avatarUrl, setAvatarUrl] = useState<string>('');
  const [isOpen, setIsOpen] = useState(false);

  const navItems =
    sidebar ||
    (user?.role === 'ADMIN'
      ? sidebarLinksAdmin
      : user?.role === 'KADES'
        ? sidebarLinksAdmin
        : sidebarLinksMember);

  useEffect(() => {
    const fetchAvatar = async () => {
      if (user?.profilePicture) {
        const url = await getAvatar(user.profilePicture);
        setAvatarUrl(url);
      }
    };
    fetchAvatar();
  }, [user?.profilePicture]);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    router.push('/login');
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger className="align-middle">
        <Menu className="h-6 w-6 text-gray-600" />
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[400px] bg-white p-0">
        <div className="flex flex-col h-full">
          <SheetHeader className="flex items-center justify-start p-4">
            <Avatar className="h-12 w-12">
              <AvatarImage
                src={avatarUrl || 'https://avatar.iran.liara.run/public'}
                alt={user?.username || 'User Avatar'}
              />
              <AvatarFallback>{user?.username?.[0] || 'U'}</AvatarFallback>
            </Avatar>
            <div className="ml-4">
              <h2 className="text-lg font-semibold">{user?.username}</h2>
              <p className="text-sm text-gray-500">{user?.email}</p>
            </div>
          </SheetHeader>
          <Separator />
          <nav className="flex-grow flex flex-col mt-4 p-4">
            {navItems.map((item, index) => {
              const isActive =
                pathname === item.route ||
                pathname.startsWith(`${item.route}/`);
              const Icon = item.icon;
              return (
                <React.Fragment key={item.route}>
                  <Link
                    href={item.route}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      'flex items-center rounded-lg p-2 transition-all',
                      isActive
                        ? 'bg-bank-gradient text-white'
                        : 'hover:bg-gray-100',
                    )}
                  >
                    <Icon
                      className={cn(
                        'h-6 w-6',
                        isActive ? 'text-white' : 'text-black-2',
                      )}
                    />
                    <span
                      className={cn(
                        'ml-3 text-sm font-medium',
                        isActive ? 'text-white font-semibold' : 'text-black-2',
                      )}
                    >
                      {item.label}
                    </span>
                  </Link>
                  {index < navItems.length - 1 && (
                    <Separator className="my-2" />
                  )}
                </React.Fragment>
              );
            })}
          </nav>
          <Separator />
          <button
            onClick={handleLogout}
            className="flex items-center rounded-lg p-2 transition-all hover:bg-gray-100 m-4"
          >
            <LogOut className="h-6 w-6 text-gray-600" />
            <span className="ml-3 text-sm font-medium text-gray-600">
              Keluar
            </span>
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;
