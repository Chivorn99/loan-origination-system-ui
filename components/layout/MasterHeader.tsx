'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Search, Bell, Settings, ChevronLeft, WalletCards } from 'lucide-react';
import { masterNavItems } from '@/lib/data/headerMasterData';
import { sidebarData } from '@/lib/data/sidebarData';

export default function MasterHeader() {
    const pathname = usePathname();
    const router = useRouter();

    const branchSlug = sidebarData.teams[0].name
        .toLowerCase()
        .replace(/\s+/g, '-');

    const dashboardPath = `/${branchSlug}/dashboard`;

    const handleBack = () => {
        if (window.history.length > 1) {
            router.back();
        } else {
            router.push(dashboardPath);
        }
    };

    return (
        <header className="w-full bg-white border-b border-gray-200">
            <div className="flex items-center justify-between px-6 py-2">
                <div className="flex items-center space-x-8">
                    <div className="flex items-center space-x-3">
                        <button
                            onClick={handleBack}
                            className="p-1 hover:bg-gray-100 rounded-full text-gray-400 transition-colors"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>

                        <div className="bg-blue-600 p-1.5 rounded-lg">
                            <WalletCards className="w-5 h-5 text-white" />
                        </div>

                        <span className="font-bold text-gray-800 text-lg tracking-tight">
                            Master Branch
                        </span>
                    </div>
                    <nav className="flex items-center space-x-6">
                        {masterNavItems.map((item) => {
                            const fullPath = `/${branchSlug}/masters${item.url}`;
                            const isActive = pathname === fullPath;

                            return (
                                <Link
                                    key={item.title}
                                    href={fullPath}
                                    className={`text-sm font-medium transition-all py-2 border-b-2 ${isActive
                                            ? 'text-blue-600 border-blue-600'
                                            : 'text-gray-500 border-transparent hover:text-gray-800'
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
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Quick find..."
                            className="pl-10 pr-4 py-1.5 bg-gray-50 border border-gray-200 rounded-md text-sm w-64 focus:ring-1 focus:ring-blue-500 outline-none"
                        />
                    </div>
                    <div className="flex items-center space-x-2 border-r border-gray-100 pr-4">
                        <Bell className="w-5 h-5 text-gray-400 cursor-pointer hover:text-gray-600" />
                        <Settings className="w-5 h-5 text-gray-400 cursor-pointer hover:text-gray-600" />
                    </div>
                    <div className="w-9 h-9 rounded-full bg-orange-100 border border-orange-200 flex items-center justify-center">
                        <span className="text-orange-600 font-bold text-xs">ADM</span>
                    </div>
                </div>
            </div>
        </header>
    );
}