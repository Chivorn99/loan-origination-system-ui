'use client';

import Link from 'next/link';
import { usePawnLoans } from '@/hooks/useLoan';
import { LoanList } from '@/components/loan/LoanList';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusIcon, Banknote, Clock, CheckCircle, TrendingUp } from 'lucide-react';

export default function LoansPage() {
  const { data } = usePawnLoans(0, 10);

  const loans = data?.data?.content ?? [];

  const active = loans.filter(l => l.status === 'ACTIVE').length;
  const redeemed = loans.filter(l => l.status === 'REDEEMED').length;
  const overdue = loans.filter(l => l.status === 'ACTIVE' && l.dueDate && new Date(l.dueDate) < new Date()).length;
  const totalDisbursed = loans.reduce((acc, l) => acc + l.loanAmount, 0);

  const stats = [
    {
      title: 'Active Loans',
      value: active.toString(),
      icon: TrendingUp,
      iconClass: 'text-primary',
      bgClass: 'bg-primary/10',
    },
    {
      title: 'Overdue Loans',
      value: overdue.toString(),
      icon: Clock,
      iconClass: 'text-destructive',
      bgClass: 'bg-destructive/10',
    },
    {
      title: 'Redeemed Loans',
      value: redeemed.toString(),
      icon: CheckCircle,
      iconClass: 'text-primary',
      bgClass: 'bg-primary/10',
    },
    {
      title: 'Total Disbursed',
      value: `$${totalDisbursed.toLocaleString()}`,
      icon: Banknote,
      iconClass: 'text-primary',
      bgClass: 'bg-primary/10',
    },
  ];

  return (
    <div className="bg-muted min-h-screen">
      <div className="mx-auto max-w-7xl space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-foreground text-2xl font-semibold">Loans</h1>
            <p className="text-muted-foreground text-sm">Manage all pawn loan records</p>
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
            <Card key={i} className="shadow-sm">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-muted-foreground text-sm font-medium">{stat.title}</CardTitle>
                  <div className={`rounded-lg p-2 ${stat.bgClass}`}>
                    <stat.icon className={`h-4 w-4 ${stat.iconClass}`} />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-foreground text-2xl font-bold">{stat.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <LoanList />
      </div>
    </div>
  );
}
