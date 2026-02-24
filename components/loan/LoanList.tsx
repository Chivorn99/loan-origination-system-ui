'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { usePawnLoans } from '@/hooks/useLoan';
import { PawnLoan } from '@/validations/loan';
import { StatusBadge } from './StatusBadge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { State } from '../State';

export function LoanList() {
  const [page, setPage] = useState(0);
  const size = 10;

  const { data, isLoading, error } = usePawnLoans(page, size);

  const loans: PawnLoan[] = data?.data?.content ?? [];
  const totalElements = data?.data?.totalElements ?? 0;
  const totalPages = data?.data?.totalPages ?? 0;
  const currentPage = data?.data?.number ?? 0;

  const start = currentPage * size + 1;
  const end = Math.min(start + size - 1, totalElements);

  return (
    <State
      isLoading={isLoading}
      error={error}
      isEmpty={!loans.length}
      emptyMessage="No loans found"
      errorMessage="Failed to load loans"
    >
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
            {loans.map(loan => (
              <TableRow key={loan.id} className="hover:bg-muted/40">
                <TableCell className="font-semibold text-blue-600">{loan.loanCode}</TableCell>

                <TableCell>
                  <div className="font-medium">{loan.customer.fullName}</div>
                  <div className="text-muted-foreground text-xs">{loan.customer.phone}</div>
                </TableCell>

                <TableCell>{loan.branch.name}</TableCell>

                <TableCell>
                  {loan.currency.symbol}
                  {loan.loanAmount.toLocaleString(undefined, {
                    minimumFractionDigits: loan.currency.decimalPlace,
                  })}
                </TableCell>

                <TableCell>
                  {loan.currency.symbol}
                  {(loan.loanAmount * (loan.interestRate / 100)).toLocaleString(undefined, {
                    minimumFractionDigits: loan.currency.decimalPlace,
                  })}
                </TableCell>

                <TableCell className="font-semibold">
                  {loan.currency.symbol}
                  {loan.totalPayableAmount.toLocaleString(undefined, {
                    minimumFractionDigits: loan.currency.decimalPlace,
                  })}
                </TableCell>

                <TableCell>{loan.dueDate ? format(new Date(loan.dueDate), 'MMM dd, yyyy') : '—'}</TableCell>

                <TableCell>
                  <StatusBadge status={loan.status} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="flex items-center justify-between border-t px-6 py-4 text-sm">
          <div className="text-muted-foreground">
            Showing {start}-{end} of {totalElements} loans
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
    </State>
  );
}
