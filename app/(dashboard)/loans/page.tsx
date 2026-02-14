'use client';
import { Button } from '@/components/ui/button';
import { Download, PlusIcon } from 'lucide-react';

export default function LoansPage() {
  return (
    <div className='flex flex-col gap-6 p-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>Loan Management</h1>
          <p className='text-muted-foreground'>Manage all your loan applications and records.</p>
        </div>
        <div className='flex gap-4'>
          <Button className='gap-2' size='lg' variant={'outline'}>
            <Download className='size-4' />
            Export CSV
          </Button>
          <Button className='gap-2' size='lg'>
            <PlusIcon className='size-4' />
            Create New Loan
          </Button>
        </div>
      </div>
      <div>
        <div className=''></div>
      </div>
    </div>
  );
}
