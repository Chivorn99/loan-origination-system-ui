'use client';

import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';

type Props = {
  lastBackup?: string;
  isLoading?: boolean;
};

export function SystemHealth({ lastBackup = '—', isLoading }: Props) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-2">
        <h2 className="text-base font-semibold text-gray-900">System Health</h2>
        {isLoading ? (
          <div className="h-4 w-36 animate-pulse rounded bg-gray-100" />
        ) : (
          <p className="text-xs text-gray-400">Last backup: {lastBackup}</p>
        )}
        <Link
          href="/settings/system"
          className="mt-1 text-sm font-medium text-blue-600 transition-colors hover:text-blue-700"
        >
          Manage Systems →
        </Link>
      </div>

      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-50">
        <CheckCircle2 size={28} className="text-green-500" />
      </div>
    </div>
  );
}
