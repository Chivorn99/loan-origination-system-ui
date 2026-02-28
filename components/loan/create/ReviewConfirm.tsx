'use client';

import { ChevronLeft, Loader2 } from 'lucide-react';
import { CustomerForm, ItemForm, LoanForm } from './types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface ReviewStepProps {
  customerForm: CustomerForm;
  itemForm: ItemForm;
  loanForm: LoanForm;
  interest: number;
  total: number;
  isPending: boolean;
  onConfirm: () => void;
  onBack: () => void;
  onCancel: () => void;
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-1">
      <dt className="text-muted-foreground text-sm">{label}</dt>
      <dd className="text-foreground text-sm font-medium">{value}</dd>
    </div>
  );
}

export default function ReviewStep({
  customerForm,
  itemForm,
  loanForm,
  interest,
  total,
  isPending,
  onConfirm,
  onBack,
  onCancel,
}: ReviewStepProps) {
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-muted-foreground text-sm font-semibold tracking-wider uppercase">
              Customer
            </CardTitle>
          </CardHeader>
          <CardContent>
            <dl>
              <ReviewRow label="Full Name" value={customerForm.fullName || '—'} />
              <ReviewRow label="Phone" value={customerForm.phone || '—'} />
              <ReviewRow label="ID Number" value={customerForm.idNumber || '—'} />
              <ReviewRow label="Address" value={customerForm.address || '—'} />
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-muted-foreground text-sm font-semibold tracking-wider uppercase">
              Pawn Item
            </CardTitle>
          </CardHeader>
          <CardContent>
            <dl>
              <ReviewRow label="Item Type" value={itemForm.itemType || '—'} />
              <ReviewRow label="Description" value={itemForm.description || '—'} />
              <ReviewRow
                label="Estimated Value"
                value={itemForm.estimatedValue ? `$${itemForm.estimatedValue.toLocaleString()}` : '—'}
              />
            </dl>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-muted-foreground text-sm font-semibold tracking-wider uppercase">
            Loan Terms
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-x-10">
            <dl>
              <ReviewRow
                label="Loan Amount"
                value={
                  loanForm.loanAmount
                    ? `$${Number(loanForm.loanAmount).toLocaleString('en-US', { minimumFractionDigits: 2 })}`
                    : '—'
                }
              />
              <ReviewRow
                label="Interest Rate"
                value={loanForm.interestRate ? `${loanForm.interestRate}% / month` : '—'}
              />
              <ReviewRow label="Accrued Interest" value={`$${interest.toFixed(2)}`} />
              <ReviewRow label="Storage Fee" value={`$${Number(loanForm.storageFee || 0).toFixed(2)}`} />
              <ReviewRow label="Penalty Rate" value={`${Number(loanForm.penaltyRate || 0).toFixed(2)}%`} />
            </dl>
            <dl>
              <ReviewRow label="Due Date" value={loanForm.dueDate || '—'} />
              <ReviewRow label="Loan Date" value={today} />
              <ReviewRow label="Loan Duration" value={`${loanForm.loanDurationDays} days`} />
              <ReviewRow label="Grace Period" value={`${loanForm.gracePeriodDays} days`} />
            </dl>
          </div>

          <Separator className="my-4" />

          <div className="bg-primary/10 flex items-center justify-between rounded-lg px-5 py-4">
            <span className="text-primary text-sm font-semibold">Total Due at Maturity</span>
            <span className="text-primary text-xl font-bold">${total.toFixed(2)}</span>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between pt-2">
        <Button variant="ghost" onClick={onBack}>
          <ChevronLeft className="mr-1 h-4 w-4" /> Back
        </Button>
        <div className="flex gap-3">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={onConfirm} disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isPending ? 'Processing...' : 'Confirm & Create Loan'}
          </Button>
        </div>
      </div>
    </div>
  );
}
