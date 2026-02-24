import React from 'react';
import { cn } from '@/lib/utils';

type Props = {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative';
  className?: string;
};

export function StatsCard({ title, value, change, changeType = 'positive', className }: Props) {
  const isPositive = changeType === 'positive';

  return (
    <div className={cn('rounded-2xl border bg-gray-50 px-6 py-5', 'flex flex-col gap-3', className)}>
      <p className="text-sm font-medium text-gray-500">{title}</p>

      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900">{value}</h2>

        {change && (
          <span
            className={cn(
              'rounded-full px-3 py-1 text-sm font-semibold',
              isPositive ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
            )}
          >
            {change}
          </span>
        )}
      </div>
    </div>
  );
}
