'use client';

import { AppHeader } from '@/components/layout/Header';
import { AppSidebar } from '@/components/layout/Sidebar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppSidebar>
      <AppHeader />
      {children}
    </AppSidebar>
  );
}
