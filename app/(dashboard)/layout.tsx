// 'use client';

// import { AppHeader } from '@/components/layout/AppHeader';
// import { AppSidebar } from '@/components/layout/AppSidebar';

// export default function DashboardLayout({ children }: { children: React.ReactNode }) {
//   return (
//     <AppSidebar>
//       <AppHeader />
//       {children}
//     </AppSidebar>
//   );
// }

'use client';

import { usePathname } from 'next/navigation';
import { AppHeader } from '@/components/layout/AppHeader';
import { AppSidebar } from '@/components/layout/AppSidebar';
import MasterHeader from '@/components/layout/MasterHeader';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isMasterMode = pathname.includes('/masters');

  return (
    <div className="min-h-screen bg-gray-50">
      {isMasterMode ? (
        <div className="flex h-screen flex-col">
          <MasterHeader />
          <main className="flex-1 overflow-y-auto p-6">{children}</main>
        </div>
      ) : (
        <AppSidebar>
          <div className="flex flex-1 flex-col">
            <AppHeader />
            <main className="p-6">{children}</main>
          </div>
        </AppSidebar>
      )}
    </div>
  );
}
