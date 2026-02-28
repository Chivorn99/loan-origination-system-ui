'use client';

import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

type Props = {
  search?: string;
  status?: string;
  statuses?: string[];
  onSearch?: (value: string) => void;
  onStatusChange?: (value: string) => void;
};

const formatStatus = (s: string) =>
  s.replace(/_/g, ' ').replace(/\w\S*/g, w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());

export function CustomerFilter({ search = '', status = '', statuses = [], onSearch, onStatusChange }: Props) {
  return (
    <Card className="shadow-sm">
      <CardContent className="px-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:gap-4">
          <div className="min-w-[220px] flex-1 space-y-1.5">
            <Label className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">Search</Label>

            <div className="relative">
              <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
              <Input
                type="text"
                value={search}
                placeholder="Search by name, ID number, phone..."
                onChange={e => onSearch?.(e.target.value)}
                className="w-full pl-9"
              />
            </div>
          </div>

          <div className="w-full space-y-1.5 lg:w-40">
            <Label className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">Status</Label>

            <Select value={status || 'ALL'} onValueChange={val => onStatusChange?.(val === 'ALL' ? '' : val)}>
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
        </div>
      </CardContent>
    </Card>
  );
}
