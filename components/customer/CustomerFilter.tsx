'use client';

import { Search } from 'lucide-react';

type Props = {
  search?: string;
  status?: string;
  statuses?: string[];
  onSearch?: (value: string) => void;
  onStatusChange?: (value: string) => void;
};

export function CustomerFilter({ search = '', status = '', statuses = [], onSearch, onStatusChange }: Props) {
  return (
    <div className="bg-background w-full rounded-2xl border p-4 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
        <div className="flex-1">
          <label className="text-muted-foreground mb-1 block text-xs font-semibold">SEARCH</label>
          <div className="relative">
            <Search size={18} className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              placeholder="Search by name, ID number, phone..."
              onChange={e => onSearch?.(e.target.value)}
              className="focus:border-primary w-full rounded-xl border bg-white py-2.5 pr-3 pl-10 text-sm outline-none"
            />
          </div>
        </div>
        <div className="w-full lg:w-56">
          <label className="text-muted-foreground mb-1 block text-xs font-semibold">STATUS</label>
          <select
            value={status}
            onChange={e => onStatusChange?.(e.target.value)}
            className="w-full rounded-xl border bg-white px-3 py-2.5 text-sm"
          >
            <option value="">All</option>
            {statuses.map(s => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
