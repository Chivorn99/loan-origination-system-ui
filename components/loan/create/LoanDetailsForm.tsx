'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { LoanForm, ItemForm, LoanStepSchema, LoanStepData } from './types';
import { Branch } from '@/validations/branch';
import { Currency } from '@/validations/currency';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import RepaymentSummary from './RepaymentSummary';

interface LoanDetailsStepProps {
  form: LoanForm;
  itemForm: ItemForm;
  onChange: (form: LoanForm) => void;
  onNext: () => void;
  onBack: () => void;
  currencies: Currency[] | undefined;
  currenciesLoading: boolean;
  branches: Branch[] | undefined;
  branchesLoading: boolean;
  interest: number;
  total: number;
}

export default function LoanDetailsStep({
  form,
  itemForm,
  onChange,
  onNext,
  onBack,
  currencies,
  currenciesLoading,
  branches,
  branchesLoading,
  interest,
  total,
}: LoanDetailsStepProps) {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<LoanStepData>({
    resolver: zodResolver(LoanStepSchema),
    defaultValues: {
      ...form,
      currencyId: form.currencyId || undefined,
      branchId: form.branchId || undefined,
      storageFee: form.storageFee ?? 0,
      penaltyRate: form.penaltyRate ?? 0,
      loanDurationDays: form.loanDurationDays ?? 30,
      gracePeriodDays: form.gracePeriodDays ?? 7,
    },
  });

  const loanAmount = watch('loanAmount');
  const interestRate = watch('interestRate');
  const computedInterest = (Number(loanAmount || 0) * Number(interestRate || 0)) / 100;
  const computedTotal = Number(loanAmount || 0) + computedInterest;

  const onSubmit = (data: LoanStepData) => {
    onChange({ ...form, ...data });
    onNext();
  };

  const handleQuickDate = (days: number) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    const formatted = date.toISOString().split('T')[0];
    setValue('dueDate', formatted, { shouldValidate: true });
    onChange({ ...form, dueDate: formatted, loanDurationDays: days });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Financial Terms</CardTitle>
          <CardDescription>Specify the amount, interest rates, and duration for this loan</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <Label>
                Currency <span className="text-destructive">*</span>
              </Label>
              <Controller
                name="currencyId"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value && field.value !== 0 ? String(field.value) : undefined}
                    onValueChange={val => field.onChange(Number(val))}
                  >
                    <SelectTrigger className={errors.currencyId ? 'border-destructive' : ''}>
                      <SelectValue placeholder={currenciesLoading ? 'Loading...' : 'Select currency'} />
                    </SelectTrigger>
                    <SelectContent>
                      {currencies?.map(c => (
                        <SelectItem key={c.id} value={String(c.id)}>
                          {c.code} — {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.currencyId && <p className="text-destructive text-xs">{errors.currencyId.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label>
                Branch <span className="text-destructive">*</span>
              </Label>
              <Controller
                name="branchId"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value && field.value !== 0 ? String(field.value) : undefined}
                    onValueChange={val => field.onChange(Number(val))}
                  >
                    <SelectTrigger className={errors.branchId ? 'border-destructive' : ''}>
                      <SelectValue placeholder={branchesLoading ? 'Loading...' : 'Select branch'} />
                    </SelectTrigger>
                    <SelectContent>
                      {branches?.map(b => (
                        <SelectItem key={b.id} value={String(b.id)}>
                          {b.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.branchId && <p className="text-destructive text-xs">{errors.branchId.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label>
                Loan Amount <span className="text-destructive">*</span>
              </Label>
              <Input
                type="number"
                placeholder="0.00"
                {...register('loanAmount')}
                className={errors.loanAmount ? 'border-destructive focus-visible:ring-destructive/30' : ''}
              />
              {itemForm.estimatedValue > 0 && (
                <p className="text-muted-foreground text-xs">
                  Suggested max: $
                  {(itemForm.estimatedValue * 0.7).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </p>
              )}
              {errors.loanAmount && <p className="text-destructive text-xs">{errors.loanAmount.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label>
                Interest Rate (Monthly %) <span className="text-destructive">*</span>
              </Label>
              <Input
                type="number"
                placeholder="0.00"
                {...register('interestRate')}
                className={errors.interestRate ? 'border-destructive focus-visible:ring-destructive/30' : ''}
              />
              {errors.interestRate && <p className="text-destructive text-xs">{errors.interestRate.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label>Loan Date</Label>
              <Input
                type="date"
                defaultValue={new Date().toISOString().split('T')[0]}
                disabled
                className="cursor-not-allowed opacity-60"
              />
            </div>

            <div className="space-y-1.5">
              <Label>
                Due Date <span className="text-destructive">*</span>
              </Label>
              <Input
                type="date"
                {...register('dueDate')}
                className={errors.dueDate ? 'border-destructive focus-visible:ring-destructive/30' : ''}
              />
              <div className="flex gap-2">
                {[30, 60, 90].map(days => (
                  <button
                    key={days}
                    type="button"
                    onClick={() => handleQuickDate(days)}
                    className="border-primary/30 bg-primary/10 text-primary hover:bg-primary/20 rounded border px-3 py-1 text-xs font-medium transition-colors"
                  >
                    +{days} Days
                  </button>
                ))}
              </div>
              {errors.dueDate && <p className="text-destructive text-xs">{errors.dueDate.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label>Storage Fee</Label>
              <Input type="number" placeholder="0.00" min={0} {...register('storageFee', { valueAsNumber: true })} />
            </div>

            <div className="space-y-1.5">
              <Label>Penalty Rate (%)</Label>
              <Input type="number" placeholder="0.00" min={0} {...register('penaltyRate', { valueAsNumber: true })} />
            </div>
          </div>
        </CardContent>
      </Card>

      <RepaymentSummary loanAmount={loanAmount} interest={computedInterest} total={computedTotal} />

      <div className="flex justify-between gap-3">
        <Button type="button" variant="ghost" onClick={onBack}>
          <ChevronLeft className="mr-1 h-4 w-4" /> Back
        </Button>
        <Button type="submit">
          Next <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </div>
    </form>
  );
}
