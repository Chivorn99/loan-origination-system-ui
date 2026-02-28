'use client';

import { useCustomers } from '@/hooks/useCustomer';
import { CustomerList } from '@/components/customer/CustomerList';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusIcon, Users, UserCheck, UserMinus, Trash2 } from 'lucide-react';

export default function CustomersPage() {
  const { data } = useCustomers(0, 100);

  const customers = data?.data.content ?? [];

  const total = customers.length;
  const active = customers.filter(c => c.status === 'ACTIVE').length;
  const inactive = customers.filter(c => c.status === 'INACTIVE').length;
  const deleted = customers.filter(c => c.status === 'DELETED').length;

  const stats = [
    { title: 'Total Customers', value: total, icon: Users, iconClass: 'text-primary', bgClass: 'bg-primary/10' },
    { title: 'Active', value: active, icon: UserCheck, iconClass: 'text-primary', bgClass: 'bg-primary/10' },
    {
      title: 'Inactive',
      value: inactive,
      icon: UserMinus,
      iconClass: 'text-destructive',
      bgClass: 'bg-destructive/10',
    },
    { title: 'Deleted', value: deleted, icon: Trash2, iconClass: 'text-destructive', bgClass: 'bg-destructive/10' },
  ];

  return (
    <div className="bg-muted min-h-screen">
      <div className="mx-auto max-w-7xl space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-foreground text-2xl font-semibold">Customers</h1>
            <p className="text-muted-foreground text-sm">Manage your pawnshop customers efficiently.</p>
          </div>
          <Button size="sm">
            <PlusIcon className="mr-2 h-4 w-4" />
            New Customer
          </Button>
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

        <CustomerList />
      </div>
    </div>
  );
}
