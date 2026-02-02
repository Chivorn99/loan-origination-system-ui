'use client';

import { AppHeader } from '@/components/layout/header';
import { AppSidebar } from '@/components/layout/sidebar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppSidebar>
      <AppHeader />
      {children}
    </AppSidebar>
  );
}
