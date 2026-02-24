'use client';

import { Search, Calendar } from 'lucide-react';

type Props = {
  onSearch?: (value: string) => void;
  branches?: string[];
  statuses?: string[];
};

export function CustomerFilters({ onSearch, branches = [], statuses = [] }: Props) {
  return (
    <div className="bg-background w-full rounded-2xl border p-4 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
        <div className="flex-1">
          <label className="text-muted-foreground mb-1 block text-xs font-semibold">SEARCH</label>
          <div className="relative">
            <Search size={18} className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, ID, phone..."
              onChange={e => onSearch?.(e.target.value)}
              className="focus:border-primary w-full rounded-xl border bg-white py-2.5 pr-3 pl-10 text-sm outline-none"
            />
          </div>
        </div>
        <div className="w-full lg:w-56">
          <label className="text-muted-foreground mb-1 block text-xs font-semibold">STATUS</label>
          <select className="w-full rounded-xl border bg-white px-3 py-2.5 text-sm">
            <option value="">All</option>
            {statuses.map(s => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>
        <div className="w-full lg:w-56">
          <label className="text-muted-foreground mb-1 block text-xs font-semibold">BRANCH</label>
          <select className="w-full rounded-xl border bg-white px-3 py-2.5 text-sm">
            <option value="">All</option>
            {branches.map(b => (
              <option key={b}>{b}</option>
            ))}
          </select>
        </div>
        <div className="w-full lg:w-60">
          <label className="text-muted-foreground mb-1 block text-xs font-semibold">DUE DATE</label>
          <div className="relative">
            <Calendar size={18} className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Select range"
              readOnly
              className="w-full rounded-xl border bg-white py-2.5 pr-3 pl-10 text-sm"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
