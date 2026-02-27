'use client';

import { Search, SlidersHorizontal, Download } from 'lucide-react';

type Props = {
  search: string;
  onSearch: (value: string) => void;
  onFilter?: () => void;
  onExport?: () => void;
};

export function CurrencyFilter({ search = '', onSearch, onFilter, onExport }: Props) {
  return (
    <div className="bg-background w-full rounded-2xl border p-3 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search size={16} className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            placeholder="Search by code, name or symbol..."
            onChange={e => onSearch?.(e.target.value)}
            className="focus:border-primary w-full rounded-xl border bg-white py-2 pr-3 pl-9 text-sm outline-none"
          />
        </div>
        <button
          onClick={onFilter}
          className="flex items-center gap-2 rounded-xl border bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
        >
          <SlidersHorizontal size={15} />
          Filter
        </button>
        <button
          onClick={onExport}
          className="flex items-center gap-2 rounded-xl border bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
        >
          <Download size={15} />
          Export
        </button>
      </div>
    </div>
  );
}
