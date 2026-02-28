'use client';

import { TrendingUp, AlertTriangle, Landmark } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StatCard } from '@/components/dashboard/Statcard';
import { RecentLoansSection } from '@/components/dashboard/RecentLoansSection';
import { BranchPerformance } from '@/components/dashboard/BranchPerformance';
import { SystemHealth } from '@/components/dashboard/SystemHealth';
import { useDashboardStats } from '@/hooks/useDashboard';

export default function DashboardPage() {
  const { data: stats, isLoading: statsLoading } = useDashboardStats();

  const formatPrincipal = (value?: number) => {
    if (!value) return '—';
    if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
    if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}k`;
    return `$${value.toLocaleString()}`;
  };

  return (
    <div className="flex flex-col gap-6 p-6">

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Dashboard Overview</h1>
          <p className="text-sm text-gray-400">Monitor branch performance and loan health.</p>
        </div>
        <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
          + Create New Loan
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          variant="DEFAULT"
          label="Active Loans"
          value={stats ? stats.activeLoans.toLocaleString() : '—'}
          change=""
          subtitle="Currently active loans"
          icon={<TrendingUp size={18} />}
          isLoading={statsLoading}
        />
        <StatCard
          variant="WARNING"
          label="Overdue Loans"
          value={stats ? stats.overdueLoans.toLocaleString() : '—'}
          change=""
          subtitle="Requires immediate attention"
          icon={<AlertTriangle size={18} />}
          isLoading={statsLoading}
        />
        <StatCard
          variant="SUCCESS"
          label="Total Principal"
          value={formatPrincipal(stats?.totalPrincipal)}
          change=""
          subtitle="Active loan portfolio value"
          icon={<Landmark size={18} />}
          isLoading={statsLoading}
        />
      </div>

      <RecentLoansSection />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <BranchPerformance
          loanRecoveryRate={stats?.loanRecoveryRate}
          customerRetentionRate={stats?.customerRetentionRate}
          isLoading={statsLoading}
        />
        <SystemHealth
          lastBackup={stats?.lastBackup}
          isLoading={statsLoading}
        />
      </div>

    </div>
  );
}