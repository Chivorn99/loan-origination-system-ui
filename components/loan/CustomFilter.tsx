'use client';

import { Search, Calendar } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

type Props = {
  showSearch?: boolean;
  showStatus?: boolean;
  showBranch?: boolean;
  showDate?: boolean;
  statuses?: string[];
  branches?: string[];
  onSearch?: (value: string) => void;
  onStatusChange?: (value: string) => void;
  onBranchChange?: (value: string) => void;
  onDateChange?: (value: string) => void;
};

const formatStatus = (s: string) =>
  s.replace(/_/g, ' ').replace(/\w\S*/g, w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());

export function CustomFilters({
  showSearch = true,
  showStatus = true,
  showBranch = true,
  showDate = false,
  statuses = [],
  branches = [],
  onSearch,
  onStatusChange,
  onBranchChange,
  onDateChange,
}: Props) {
  return (
    <Card className="shadow-sm">
      <CardContent className="px-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:gap-4">

          {showSearch && (
            <div className="flex-1 min-w-[220px] space-y-1.5">
              <Label className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                Search
              </Label>

              <div className="relative">
                <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                <Input
                  type="text"
                  placeholder="Search by loan code..."
                  onChange={e => onSearch?.(e.target.value)}
                  className="pl-9 w-full"
                />
              </div>
            </div>
          )}

          {showStatus && (
            <div className="w-full lg:w-40 space-y-1.5">
              <Label className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                Status
              </Label>

              <Select onValueChange={val => onStatusChange?.(val === 'ALL' ? '' : val)}>
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="ALL">All statuses</SelectItem>
                  {statuses.map(s => (
                    <SelectItem key={s} value={s}>
                      {formatStatus(s)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {showBranch && (
            <div className="w-full lg:w-40 space-y-1.5">
              <Label className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                Branch
              </Label>

              <Select onValueChange={val => onBranchChange?.(val === 'ALL' ? '' : val)}>
                <SelectTrigger>
                  <SelectValue placeholder="All branches" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="ALL">All branches</SelectItem>
                  {branches.map(b => (
                    <SelectItem key={b} value={b}>
                      {b}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {showDate && (
            <div className="w-full lg:w-40 space-y-1.5">
              <Label className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                Due Date
              </Label>

              <div className="relative">
                <Calendar className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                <Input
                  type="date"
                  onChange={e => onDateChange?.(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
          )}

        </div>
      </CardContent>
    </Card>
  );
}