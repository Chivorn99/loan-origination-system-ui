'use client';

import { CurrencyList } from '@/components/currency/CurrencyList';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';
import { useState } from 'react';

export default function MastersPage() {
  const [triggerCreate, setTriggerCreate] = useState(false);
  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Currency Management</h1>
          <p className="text-muted-foreground">Configure and manage supported currencies for shop operation.</p>
        </div>
        <Button className="gap-2" size="lg" onClick={() => setTriggerCreate(true)}>
          <PlusIcon className="size-4" />
          Add New Currency
        </Button>
      </div>

      <CurrencyList triggerCreate={triggerCreate} onCreateHandled={() => setTriggerCreate(false)} />
    </div>
  );
}
