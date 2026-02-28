'use client';

import { useMemo, useState } from 'react';
import { format } from 'date-fns';
import { useCustomers } from '@/hooks/useCustomer';
import { Customer } from '@/validations/customer';
import { StatusBadge } from '@/components/customer/StatusBadge';
import { CustomerFilter } from '@/components/customer/CustomerFilter';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { State } from '@/components/State';

export function CustomerList() {
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const size = 10;

  const { data, isLoading, error } = useCustomers(page, size);

  const customers: Customer[] = useMemo(() => data?.data?.content ?? [], [data?.data?.content]);
  const totalElements = data?.data?.totalElements ?? 0;
  const totalPages = data?.data?.totalPages ?? 0;
  const currentPage = data?.data?.number ?? 0;

  const statuses = useMemo(() => Array.from(new Set(customers.map(c => c.status))).filter(Boolean), [customers]);

  const filteredCustomers = useMemo(() => {
    const s = search.trim().toLowerCase();
    return customers.filter(c => {
      const matchesSearch =
        !s ||
        c.fullName.toLowerCase().includes(s) ||
        c.idNumber.toLowerCase().includes(s) ||
        (c.phone && c.phone.toLowerCase().includes(s));
      const matchesStatus = !statusFilter || c.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [customers, search, statusFilter]);

  const displayedCount = filteredCustomers.length;
  const start = displayedCount ? currentPage * size + 1 : 0;
  const end = displayedCount ? start + displayedCount - 1 : 0;

  return (
    <State
      isLoading={isLoading}
      error={error}
      isEmpty={!displayedCount}
      emptyMessage="No customers found"
      errorMessage="Failed to load customers"
    >
      <div className="space-y-4">
        <CustomerFilter
          search={search}
          status={statusFilter}
          statuses={statuses}
          onSearch={v => {
            setSearch(v);
            setPage(0);
          }}
          onStatusChange={v => {
            setStatusFilter(v);
            setPage(0);
          }}
        />

        <div className="bg-background overflow-hidden rounded-xl border shadow-sm">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead className="text-xs font-semibold tracking-wider uppercase">Name</TableHead>
                <TableHead className="text-xs font-semibold tracking-wider uppercase">ID Number</TableHead>
                <TableHead className="text-xs font-semibold tracking-wider uppercase">Phone</TableHead>
                <TableHead className="text-xs font-semibold tracking-wider uppercase">Address</TableHead>
                <TableHead className="text-xs font-semibold tracking-wider uppercase">Created</TableHead>
                <TableHead className="text-xs font-semibold tracking-wider uppercase">Status</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredCustomers.map(customer => (
                <TableRow key={customer.id} className="hover:bg-muted/40 cursor-pointer transition-colors">
                  <TableCell className="font-medium">{customer.fullName}</TableCell>
                  <TableCell className="text-sm">{customer.idNumber}</TableCell>
                  <TableCell className="text-sm">{customer.phone ?? '—'}</TableCell>
                  <TableCell className="text-sm">{customer.address ?? '—'}</TableCell>
                  <TableCell className="text-sm">
                    {customer.createdAt ? format(new Date(customer.createdAt), 'MMM dd, yyyy') : '—'}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={customer.status} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="flex items-center justify-between border-t px-6 py-4">
            <p className="text-muted-foreground text-sm">
              Showing{' '}
              <span className="text-foreground font-medium">
                {start}–{end}
              </span>{' '}
              of <span className="text-foreground font-medium">{totalElements}</span> customers
            </p>

            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                disabled={currentPage === 0}
                onClick={() => setPage(p => p - 1)}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              {Array.from({ length: totalPages }).map((_, i) => (
                <Button
                  key={i}
                  variant={i === currentPage ? 'default' : 'outline'}
                  size="icon"
                  className="h-8 w-8 text-xs"
                  onClick={() => setPage(i)}
                >
                  {i + 1}
                </Button>
              ))}

              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                disabled={currentPage === totalPages - 1}
                onClick={() => setPage(p => p + 1)}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </State>
  );
}
