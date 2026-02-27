'use client';

import { AppHeader } from '@/components/layout/AppHeader';
import { AppSidebar } from '@/components/layout/AppSidebar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppSidebar>
      <AppHeader />
      {children}
    </AppSidebar>
  );
}
