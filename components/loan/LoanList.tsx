'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';

import { usePawnLoans } from '@/hooks/useLoan';

import { StatusBadge } from './StatusBadge';
import { CustomFilters } from './CustomFilter';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function LoanList() {
  const router = useRouter();

  const [page, setPage] = useState(0);
  const [statusFilter, setStatusFilter] = useState<string | undefined>();

  const size = 10;

  const { data, isLoading, error } = usePawnLoans(page, size, statusFilter);

  const loans = data?.data?.content ?? [];
  const totalElements = data?.data?.totalElements ?? 0;
  const totalPages = data?.data?.totalPages ?? 0;
  const currentPage = data?.data?.number ?? 0;

  const start = totalElements ? currentPage * size + 1 : 0;
  const end = Math.min(start + size - 1, totalElements);

  return (
    <div className="space-y-4">
      <CustomFilters
        showSearch={false}
        showBranch={false}
        showDate={false}
        showStatus
        statuses={['ACTIVE', 'CREATED', 'REDEEMED', 'DEFAULTED', 'OVERDUE', 'PENDING', 'PARTIALLY_PAID', 'CANCELLED']}
        onStatusChange={value => {
          setPage(0);
          setStatusFilter(value || undefined);
        }}
      />

      <div className="bg-background overflow-hidden rounded-xl border shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="text-xs font-semibold tracking-wider uppercase">Loan Code</TableHead>
              <TableHead className="text-xs font-semibold tracking-wider uppercase">Customer</TableHead>
              <TableHead className="text-xs font-semibold tracking-wider uppercase">Branch</TableHead>
              <TableHead className="text-xs font-semibold tracking-wider uppercase">Amount</TableHead>
              <TableHead className="text-xs font-semibold tracking-wider uppercase">Interest</TableHead>
              <TableHead className="text-xs font-semibold tracking-wider uppercase">Total</TableHead>
              <TableHead className="text-xs font-semibold tracking-wider uppercase">Due Date</TableHead>
              <TableHead className="text-xs font-semibold tracking-wider uppercase">Status</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading &&
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 8 }).map((_, j) => (
                    <TableCell key={j}>
                      <div className="bg-muted h-4 w-full animate-pulse rounded" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}

            {!isLoading && error && (
              <TableRow>
                <TableCell colSpan={8} className="text-destructive py-10 text-center text-sm">
                  Failed to load loans. Please try again.
                </TableCell>
              </TableRow>
            )}

            {!isLoading && !error && loans.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="text-muted-foreground py-10 text-center text-sm">
                  No loans found
                </TableCell>
              </TableRow>
            )}

            {!isLoading &&
              loans.map(loan => (
                <TableRow
                  key={loan.id}
                  onClick={() => router.push(`/loans/${loan.id}`)}
                  className="hover:bg-muted/40 cursor-pointer transition-colors"
                >
                  <TableCell className="text-primary font-semibold">{loan.loanCode}</TableCell>

                  <TableCell>
                    <div className="font-medium">{loan.customer?.fullName}</div>
                    <div className="text-muted-foreground text-xs">{loan.customer?.phone}</div>
                  </TableCell>

                  <TableCell className="text-sm">{loan.branch?.name}</TableCell>

                  <TableCell className="text-sm">
                    {loan.currency?.symbol}
                    {loan.loanAmount?.toLocaleString()}
                  </TableCell>

                  <TableCell className="text-sm">
                    {loan.currency?.symbol}
                    {(loan.loanAmount * (loan.interestRate / 100)).toLocaleString()}
                  </TableCell>

                  <TableCell className="text-sm font-semibold">
                    {loan.currency?.symbol}
                    {loan.totalPayableAmount?.toLocaleString()}
                  </TableCell>

                  <TableCell className="text-sm">
                    {loan.dueDate ? format(new Date(loan.dueDate), 'MMM dd, yyyy') : '—'}
                  </TableCell>

                  <TableCell>
                    <StatusBadge status={loan.status} />
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>

        {totalPages > 0 && (
          <div className="flex items-center justify-between border-t px-6 py-4">
            <p className="text-muted-foreground text-sm">
              Showing{' '}
              <span className="text-foreground font-medium">
                {start}–{end}
              </span>{' '}
              of <span className="text-foreground font-medium">{totalElements}</span> loans
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
        )}
      </div>
    </div>
  );
}
