'use client';

import { StatsCard } from '@/components/StateCard';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';
import { useCustomers } from '@/hooks/useCustomer';
import { CustomerList } from '@/components/customer/CustomerList';

export default function CustomersPage() {
  const { data } = useCustomers(0, 100);

  const customers = data?.data.content ?? [];

  const total = customers.length;
  const active = customers.filter(c => c.status === 'ACTIVE').length;
  const inactive = customers.filter(c => c.status === 'INACTIVE').length;
  const deleted = customers.filter(c => c.status === 'DELETED').length;

  const stats = [
    {
      title: 'Total Customers',
      value: total.toString(),
      change: '',
      changeType: 'positive' as const,
    },
    {
      title: 'Active Customers',
      value: active.toString(),
      change: '',
      changeType: 'positive' as const,
    },
    {
      title: 'Inactive Customers',
      value: inactive.toString(),
      change: '',
      changeType: 'negative' as const,
    },
    {
      title: 'Deleted Customers',
      value: deleted.toString(),
      change: '',
      changeType: 'negative' as const,
    },
  ];

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Customer</h1>
          <p className="text-muted-foreground">Manage your pawnshop customers efficiently.</p>
        </div>

        <Button size="lg">
          <PlusIcon className="mr-2 size-4" />
          New Customer
        </Button>
      </div>

      <div className="flex flex-wrap gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="min-w-62.5 flex-1">
            <StatsCard {...stat} />
          </div>
        ))}
      </div>

      <CustomerList />
    </div>
  );
}
