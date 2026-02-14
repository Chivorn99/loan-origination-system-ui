'use client';

import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className='flex flex-col gap-6 p-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>Dashboard Overview</h1>
          <p className='text-muted-foreground'>Monitor branch performance and loan health.</p>
        </div>
        <Button className='gap-2' size='lg'>
          <PlusIcon className='size-4' />
          Create New Loan
        </Button>
      </div>
    </div>
  );
}
