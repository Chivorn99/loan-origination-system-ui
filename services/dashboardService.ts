import { LoanCountPageSchema, DashboardStatsSchema } from '@/validations/dashboard';

async function fetchLoanStats(status: string) {
  const res = await fetch(`/api/loans?page=0&size=1&status=${status}`);
  if (!res.ok) throw new Error(`Failed to fetch ${status} loans`);
  const json = await res.json();
  return LoanCountPageSchema.parse(json);
}

async function fetchTotalPrincipal() {
  const res = await fetch(`/api/loans?page=0&size=1000&status=ACTIVE`);
  if (!res.ok) throw new Error('Failed to fetch principal');
  const json = await res.json();
  const parsed = LoanCountPageSchema.parse(json);
  const total = parsed.data.content.reduce((sum, loan) => sum + (loan.totalPayableAmount ?? 0), 0);
  return total;
}

export const dashboardService = {
  async getStats() {
    const [activeData, overdueData, totalPrincipal] = await Promise.all([
      fetchLoanStats('ACTIVE'),
      fetchLoanStats('OVERDUE'),
      fetchTotalPrincipal(),
    ]);

    return DashboardStatsSchema.parse({
      activeLoans: activeData.data.totalElements,
      overdueLoans: overdueData.data.totalElements,
      totalPrincipal,
      loanRecoveryRate: 94.2,
      customerRetentionRate: 82,
      lastBackup: '14 mins ago',
    });
  },
};
