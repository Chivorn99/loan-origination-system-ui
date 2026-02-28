'use client';

import { useState } from 'react';
import { Coins, GitBranch, CreditCard, PlusIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { CurrencyList } from '@/components/currency/CurrencyList';
import { BranchList } from '@/components/branch/BranchList';
import { PaymentMethodList } from '@/components/paymentMethod/PaymentMethodList';

type Tab = 'currency' | 'branch' | 'payment-method';

export default function MastersPage() {
  const [activeTab, setActiveTab] = useState<Tab>('currency');
  const [triggerCreate, setTriggerCreate] = useState(false);

  const tabConfig: Record<Tab, { label: string; icon: React.ReactNode; description: string }> = {
    currency: {
      label: 'Currencies',
      icon: <Coins className="h-4 w-4" />,
      description: 'Configure and manage supported currencies',
    },
    branch: {
      label: 'Branches',
      icon: <GitBranch className="h-4 w-4" />,
      description: 'Manage pawnshop branch locations',
    },
    'payment-method': {
      label: 'Payment Methods',
      icon: <CreditCard className="h-4 w-4" />,
      description: 'Manage available payment methods',
    },
  };

  const addLabels: Record<Tab, string> = {
    currency: 'Add Currency',
    branch: 'Add Branch',
    'payment-method': 'Add Payment Method',
  };

  return (
    <div className="min-h-screen bg-muted">
      <div className="mx-auto max-w-6xl space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Master Data</h1>
            <p className="text-sm text-muted-foreground">{tabConfig[activeTab].description}</p>
          </div>
          <Button size="sm" onClick={() => setTriggerCreate(true)}>
            <PlusIcon className="mr-2 h-4 w-4" />
            {addLabels[activeTab]}
          </Button>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={v => {
            setActiveTab(v as Tab);
            setTriggerCreate(false);
          }}
        >
          <TabsList className="border bg-background">
            {(Object.entries(tabConfig) as [Tab, (typeof tabConfig)[Tab]][]).map(([key, val]) => (
              <TabsTrigger key={key} value={key} className="flex items-center gap-2">
                {val.icon}
                {val.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="currency" className="mt-4">
            <CurrencyList
              triggerCreate={activeTab === 'currency' && triggerCreate}
              onCreateHandled={() => setTriggerCreate(false)}
            />
          </TabsContent>

          <TabsContent value="branch" className="mt-4">
            <BranchList
              triggerCreate={activeTab === 'branch' && triggerCreate}
              onCreateHandled={() => setTriggerCreate(false)}
            />
          </TabsContent>

          <TabsContent value="payment-method" className="mt-4">
            <PaymentMethodList
              triggerCreate={activeTab === 'payment-method' && triggerCreate}
              onCreateHandled={() => setTriggerCreate(false)}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}