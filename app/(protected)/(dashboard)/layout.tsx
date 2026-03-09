'use client';

import { AppHeader } from '@/components/layout/AppHeader';
import { AppSidebar } from '@/components/layout/AppSidebar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <AppSidebar>
        <div className="flex flex-1 flex-col">
          <AppHeader />
          <main className="p-6">{children}</main>
        </div>
      </AppSidebar>
    </div>
  );
}
