'use client';

type Status = 'ACTIVE' | 'INACTIVE' | 'DELETED';

const styles: Record<Status, string> = {
  ACTIVE: 'bg-green-100 text-green-700',
  INACTIVE: 'bg-yellow-100 text-yellow-700',
  DELETED: 'bg-gray-100 text-gray-600',
};

export function StatusBadge({ status }: { status: string }) {
  const style = styles[status as Status] ?? 'bg-gray-100 text-gray-600';
  const label = status.charAt(0) + status.slice(1).toLowerCase();

  return <span className={`rounded-full px-2 py-1 text-xs font-medium ${style}`}>{label}</span>;
}
