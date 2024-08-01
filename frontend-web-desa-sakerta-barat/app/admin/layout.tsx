'use client';
import Sidebar from '@/components/shared/Sidebar';
import { UserProvider } from '../context/UserContext';
import HeaderDashboard from '../../components/shared/HeaderDashboard';
import { Toaster } from '../../components/ui/toaster';
import { sidebarLinksAdmin } from '../../constants';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '../../lib/reactQuery';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <main className="flex h-screen w-full font-inter">
          <Sidebar sidebar={sidebarLinksAdmin} />

          <div className="flex flex-col flex-grow">
            <HeaderDashboard />
            <div className="flex-grow overflow-auto p-6">{children}</div>
          </div>
          <Toaster />
        </main>
      </UserProvider>
    </QueryClientProvider>
  );
}
