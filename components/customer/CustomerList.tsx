'use client';

import { useMemo, useState } from 'react';
import { format } from 'date-fns';
import { useCustomers } from '@/hooks/useCustomer';
import { Customer } from '@/validations/customer';
import { StatusBadge } from '@/components/customer/StatusBadge';
import { CustomerFilter } from '@/components/customer/CustomerFilter';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
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

  const statuses = Array.from(new Set(customers.map(c => c.status))).filter(Boolean);

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

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(0);
  };

  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
    setPage(0);
  };

  return (
    <State
      isLoading={isLoading}
      error={error}
      isEmpty={!displayedCount}
      emptyMessage="No customers found"
      errorMessage="Failed to load customers"
    >
      <div className="flex flex-col gap-4">
        <CustomerFilter
          search={search}
          status={statusFilter}
          statuses={statuses}
          onSearch={handleSearch}
          onStatusChange={handleStatusChange}
        />

        <div className="bg-background overflow-hidden rounded-2xl border shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>ID Number</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredCustomers.map(customer => (
                <TableRow key={customer.id} className="hover:bg-muted/40">
                  <TableCell className="font-semibold">{customer.fullName}</TableCell>
                  <TableCell>{customer.idNumber}</TableCell>
                  <TableCell>{customer.phone ?? '—'}</TableCell>
                  <TableCell>{customer.address ?? '—'}</TableCell>
                  <TableCell>
                    {customer.createdAt ? format(new Date(customer.createdAt), 'MMM dd, yyyy') : '—'}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={customer.status} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="flex items-center justify-between border-t px-6 py-4 text-sm">
            <div className="text-muted-foreground">
              {displayedCount
                ? `Showing ${start}–${end} of ${totalElements} customers`
                : `Showing 0 of ${totalElements} customers`}
            </div>

            <div className="flex gap-2">
              <button
                disabled={currentPage === 0}
                onClick={() => setPage(p => p - 1)}
                className="rounded-md border px-3 py-1 disabled:opacity-40"
              >
                ‹
              </button>

              {Array.from({ length: totalPages }).map((_, i) => {
                const isActive = i === currentPage;
                return (
                  <button
                    key={i}
                    onClick={() => setPage(i)}
                    className={`rounded-md border px-3 py-1 ${
                      isActive ? 'border-blue-600 bg-blue-600 text-white' : 'hover:bg-muted'
                    }`}
                  >
                    {i + 1}
                  </button>
                );
              })}

              <button
                disabled={currentPage === totalPages - 1}
                onClick={() => setPage(p => p + 1)}
                className="rounded-md border px-3 py-1 disabled:opacity-40"
              >
                ›
              </button>
            </div>
          </div>
        </div>
      </div>
    </State>
  );
}
