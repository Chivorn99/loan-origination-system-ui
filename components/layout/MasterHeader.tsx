'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Search, Bell, Settings, ChevronLeft, WalletCards } from 'lucide-react';
import { masterNavItems } from '@/lib/data/headerMasterData';
import { sidebarData } from '@/lib/data/sidebarData';

export default function MasterHeader() {
  const pathname = usePathname();
  const router = useRouter();

  const branchSlug = sidebarData.teams[0].name.toLowerCase().replace(/\s+/g, '-');

  const dashboardPath = `/${branchSlug}/dashboard`;

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push(dashboardPath);
    }
  };

  return (
    <header className="w-full border-b border-gray-200 bg-white">
      <div className="flex items-center justify-between px-6 py-2">
        <div className="flex items-center space-x-8">
          <div className="flex items-center space-x-3">
            <button onClick={handleBack} className="rounded-full p-1 text-gray-400 transition-colors hover:bg-gray-100">
              <ChevronLeft className="h-5 w-5" />
            </button>

            <div className="rounded-lg bg-blue-600 p-1.5">
              <WalletCards className="h-5 w-5 text-white" />
            </div>

            <span className="text-lg font-bold tracking-tight text-gray-800">Master Branch</span>
          </div>
          <nav className="flex items-center space-x-6">
            {masterNavItems.map(item => {
              const fullPath = `/${branchSlug}/masters${item.url}`;
              const isActive = pathname === fullPath;

              return (
                <Link
                  key={item.title}
                  href={fullPath}
                  className={`border-b-2 py-2 text-sm font-medium transition-all ${
                    isActive ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-800'
                  }`}
                >
                  {item.title}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Quick find..."
              className="w-64 rounded-md border border-gray-200 bg-gray-50 py-1.5 pr-4 pl-10 text-sm outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center space-x-2 border-r border-gray-100 pr-4">
            <Bell className="h-5 w-5 cursor-pointer text-gray-400 hover:text-gray-600" />
            <Settings className="h-5 w-5 cursor-pointer text-gray-400 hover:text-gray-600" />
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-full border border-orange-200 bg-orange-100">
            <span className="text-xs font-bold text-orange-600">ADM</span>
          </div>
        </div>
      </div>
    </header>
  );
}
