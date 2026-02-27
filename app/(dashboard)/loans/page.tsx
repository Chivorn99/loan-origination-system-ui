'use client';

import Link from 'next/link';
import { usePawnLoans } from '@/hooks/useLoan';
import { LoanList } from '@/components/loan/LoanList';
import { StatsCard } from '@/components/StateCard';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';

export default function LoansPage() {
  const { data } = usePawnLoans(0, 10);

  const loans = data?.data?.content ?? [];

  const active = loans.filter(l => l.status === 'ACTIVE').length;
  const redeemed = loans.filter(l => l.status === 'REDEEMED').length;
  const overdue = loans.filter(l => l.status === 'ACTIVE' && l.dueDate && new Date(l.dueDate) < new Date()).length;

  const totalDisbursed = loans.reduce((acc, l) => acc + l.loanAmount, 0);

  const stats = [
    { title: 'Active Loans', value: active.toString(), change: '', changeType: 'positive' as const },
    { title: 'Overdue Loans', value: overdue.toString(), change: '', changeType: 'negative' as const },
    { title: 'Redeemed Loans', value: redeemed.toString(), change: '', changeType: 'positive' as const },
    {
      title: 'Total Disbursed',
      value: `$${totalDisbursed.toLocaleString()}`,
      change: '',
      changeType: 'positive' as const,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Loans</h1>
            <p className="text-sm text-gray-500">Manage all pawn loan records</p>
          </div>

          <Link href="/loans/create">
            <Button size="sm">
              <PlusIcon className="mr-2 h-4 w-4" />
              New Loan
            </Button>
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <StatsCard key={i} {...stat} />
          ))}
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <LoanList />
        </div>
      </div>
    </div>
  );
}
