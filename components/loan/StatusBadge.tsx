'use client';

export function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    ACTIVE: 'bg-blue-100 text-blue-700',
    REDEEMED: 'bg-green-100 text-green-700',
    DEFAULTED: 'bg-red-100 text-red-700',
    INACTIVE: 'bg-gray-100 text-gray-600',
  };

  return (
    <span className={`rounded-full px-2 py-1 text-xs font-medium ${styles[status] ?? 'bg-gray-100 text-gray-600'}`}>
      {status}
    </span>
  );
}
