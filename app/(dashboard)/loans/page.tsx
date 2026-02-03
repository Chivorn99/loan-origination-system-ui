'use client';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';

export default function LoansPage() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Loans</h1>
          <p className="text-muted-foreground">Manage all your loan applications and records.</p>
        </div>
        <Button className="gap-2" size="lg">
          <PlusIcon className="size-4" />
          New Loan
        </Button>
      </div>
    </div>
  );
}
