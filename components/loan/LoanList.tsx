'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';

import { usePawnLoans } from '@/hooks/useLoan';
import { PawnLoan } from '@/validations/loan';

import { StatusBadge } from './StatusBadge';
import { CustomFilters } from './CustomFilter';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export function LoanList() {
  const router = useRouter();

  const [page, setPage] = useState(0);
  const [statusFilter, setStatusFilter] = useState<string | undefined>();
  const [search, setSearch] = useState<string>('');

  const size = 10;

  const { data, isLoading, error } = usePawnLoans(page, size, statusFilter, search);

  const loans: PawnLoan[] = data?.data?.content ?? [];
  const totalElements = data?.data?.totalElements ?? 0;
  const totalPages = data?.data?.totalPages ?? 0;
  const currentPage = data?.data?.number ?? 0;

  const start = totalElements ? currentPage * size + 1 : 0;
  const end = Math.min(start + size - 1, totalElements);

  return (
    <div className="space-y-4">
      {/* FILTERS */}
      <CustomFilters
        showSearch
        showBranch={false}
        showDate={false}
        showStatus
        statuses={['ACTIVE', 'CREATED', 'REDEEMED', 'DEFAULTED', 'OVERDUE']}
        onSearch={value => {
          setPage(0);
          setSearch(value.trim());
        }}
        onStatusChange={value => {
          setPage(0);
          setSearch(''); // clear search when filtering
          setStatusFilter(value || undefined);
        }}
      />

      <div className="bg-background overflow-hidden rounded-2xl border shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Loan Code</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Branch</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Interest</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading &&
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={8}>
                    <div className="bg-muted h-6 w-full animate-pulse rounded" />
                  </TableCell>
                </TableRow>
              ))}

            {!isLoading && error && (
              <TableRow>
                <TableCell colSpan={8} className="py-6 text-center text-red-500">
                  Failed to load loans
                </TableCell>
              </TableRow>
            )}

            {!isLoading && !error && loans.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="text-muted-foreground py-6 text-center">
                  No loans found
                </TableCell>
              </TableRow>
            )}

            {!isLoading &&
              loans.map(loan => (
                <TableRow
                  key={loan.id}
                  onClick={() => router.push(`/loans/${loan.id}`)}
                  className="hover:bg-muted/40 cursor-pointer transition"
                >
                  <TableCell className="font-semibold text-blue-600">{loan.loanCode}</TableCell>

                  <TableCell>
                    <div className="font-medium">{loan.customer?.fullName}</div>
                    <div className="text-muted-foreground text-xs">{loan.customer?.phone}</div>
                  </TableCell>

                  <TableCell>{loan.branch?.name}</TableCell>

                  <TableCell>
                    {loan.currency?.symbol}
                    {loan.loanAmount?.toLocaleString()}
                  </TableCell>

                  <TableCell>
                    {loan.currency?.symbol}
                    {(loan.loanAmount * (loan.interestRate / 100)).toLocaleString()}
                  </TableCell>

                  <TableCell className="font-semibold">
                    {loan.currency?.symbol}
                    {loan.totalPayableAmount?.toLocaleString()}
                  </TableCell>

                  <TableCell>{loan.dueDate ? format(new Date(loan.dueDate), 'MMM dd, yyyy') : '—'}</TableCell>

                  <TableCell>
                    <StatusBadge status={loan.status} />
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>

        {/* PAGINATION (disabled during search) */}
        {!search && (
          <div className="flex items-center justify-between border-t px-6 py-4 text-sm">
            <div className="text-muted-foreground">
              Showing {start}-{end} of {totalElements} loans
            </div>

            <div className="flex gap-2">
              <button
                disabled={currentPage === 0}
                onClick={() => setPage(p => p - 1)}
                className="hover:bg-muted h-9 w-9 rounded-md border disabled:opacity-40"
              >
                ‹
              </button>

              {Array.from({ length: totalPages }).map((_, i) => {
                const isActive = i === currentPage;

                return (
                  <button
                    key={i}
                    onClick={() => setPage(i)}
                    className={`h-9 w-9 rounded-md border ${
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
                className="hover:bg-muted h-9 w-9 rounded-md border disabled:opacity-40"
              >
                ›
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
