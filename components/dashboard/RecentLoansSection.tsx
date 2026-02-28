'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { MoreVertical } from 'lucide-react';

import { usePawnLoans } from '@/hooks/useLoan';
import type { PawnLoanList } from '@/validations/loan';
import { StatusBadge } from '@/components/loan/StatusBadge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

// ─── Avatar ───────────────────────────────────────────────────────────────────

const AVATAR_COLORS = ['#6366f1', '#f59e0b', '#10b981', '#ef4444', '#3b82f6', '#8b5cf6', '#ec4899', '#14b8a6'];

function getInitials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map(n => n[0])
    .join('')
    .toUpperCase();
}

function getColor(name: string): string {
  const index = name.charCodeAt(0) % AVATAR_COLORS.length;
  return AVATAR_COLORS[index];
}

function Avatar({ name }: { name: string }) {
  return (
    <span
      className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white"
      style={{ backgroundColor: getColor(name) }}
    >
      {getInitials(name)}
    </span>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function SkeletonRow() {
  return (
    <TableRow className="animate-pulse">
      {[1, 2, 3, 4, 5, 6].map(i => (
        <TableCell key={i}>
          <div className="h-4 rounded bg-gray-100" style={{ width: `${40 + i * 8}%` }} />
        </TableCell>
      ))}
    </TableRow>
  );
}

// ─── RecentLoansSection ───────────────────────────────────────────────────────

export function RecentLoansSection() {
  const router = useRouter();

  // Reuse existing hook — page 0, size 5, no filter, no search
  const { data, isLoading, error } = usePawnLoans(0, 5, undefined, undefined);

  const loans: PawnLoanList[] = data?.data?.content ?? [];

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4">
        <h2 className="text-base font-semibold text-gray-900">Recent Loans</h2>
        <Link href="/loans" className="text-sm font-medium text-blue-600 transition-colors hover:text-blue-700">
          View All
        </Link>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50/60">
            <TableHead>Loan Code</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {/* Loading */}
          {isLoading && Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)}

          {/* Error */}
          {!isLoading && error && (
            <TableRow>
              <TableCell colSpan={6} className="py-8 text-center text-sm text-red-500">
                Failed to load recent loans
              </TableCell>
            </TableRow>
          )}

          {/* Empty */}
          {!isLoading && !error && loans.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-muted-foreground py-8 text-center text-sm">
                No loans found
              </TableCell>
            </TableRow>
          )}

          {/* Rows */}
          {!isLoading &&
            loans.map(loan => (
              <TableRow
                key={loan.id}
                onClick={() => router.push(`/loans/${loan.id}`)}
                className="hover:bg-muted/30 cursor-pointer transition"
              >
                {/* Loan Code */}
                <TableCell className="font-semibold text-gray-800">{loan.loanCode}</TableCell>

                {/* Customer with avatar */}
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar name={loan.customer?.fullName ?? '?'} />
                    <span className="text-sm text-gray-700">{loan.customer?.fullName}</span>
                  </div>
                </TableCell>

                {/* Amount */}
                <TableCell className="font-medium text-gray-800">
                  {loan.currency?.symbol}
                  {loan.loanAmount?.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </TableCell>

                {/* Due Date — red if overdue */}
                <TableCell className={loan.status === 'OVERDUE' ? 'font-medium text-red-500' : 'text-gray-600'}>
                  {loan.dueDate ? format(new Date(loan.dueDate), 'MMM dd, yyyy') : '—'}
                </TableCell>

                {/* Status — reuse existing StatusBadge */}
                <TableCell>
                  <StatusBadge status={loan.status} />
                </TableCell>

                {/* Action */}
                <TableCell className="text-right">
                  <button
                    onClick={e => {
                      e.stopPropagation(); // prevent row click
                    }}
                    className="rounded-lg p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                  >
                    <MoreVertical size={16} />
                  </button>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
}
