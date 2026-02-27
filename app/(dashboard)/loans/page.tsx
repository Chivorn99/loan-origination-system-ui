'use client';

import { usePawnLoans } from '@/hooks/useLoan';
import { LoanList } from '@/components/loan/LoanList';
import { StatsCard } from '@/components/StateCard';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';
import { CustomerFilters } from '@/components/loan/CustomFilter';

export default function LoansPage() {
  const { data } = usePawnLoans(0, 100);
  const loans = data?.data?.content ?? [];

  const active = loans.filter(l => l.status === 'ACTIVE').length;
  const redeemed = loans.filter(l => l.status === 'REDEEMED').length;
  const overdue = loans.filter(l => l.status === 'ACTIVE' && l.dueDate && new Date(l.dueDate) < new Date()).length;

  const totalDisbursed = loans.reduce((acc, l) => acc + l.loanAmount, 0);

  const branches = Array.from(new Set(loans.map(l => l.branch.name)));
  const statuses = Array.from(new Set(loans.map(l => l.status)));

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
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Loans</h1>
          <p className="text-muted-foreground">Manage all loan records</p>
        </div>

        <div className="flex gap-2">
          <Button size="lg">
            <PlusIcon className="mr-2 size-4" />
            New Loan
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="min-w-55 flex-1">
            <StatsCard {...stat} />
          </div>
        ))}
      </div>

      <CustomerFilters branches={branches} statuses={statuses} />

      <LoanList />
    </div>
  );
}
