'use client';

import { useParams, useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { usePawnLoanDetail } from '@/hooks/useLoan';
import { useCreateRepayment } from '@/hooks/useRepayment';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { CreateRepaymentSchema, CreateRepaymentPayload } from '@/validations/repayment';

export default function RecordPaymentPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();

  const loanId = params.id;

  const { data: loan } = usePawnLoanDetail(loanId);
  const createRepayment = useCreateRepayment();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CreateRepaymentPayload>({
    resolver: zodResolver(CreateRepaymentSchema),
  });

  const amount = watch('paidAmount') ?? 0;

  if (!loan) return null;

  const principal = Number(loan.loanAmount);
  const interestDue = Number(loan.totalPayableAmount) - principal;
  const penaltyDue = 0;

  const totalDue = principal + interestDue + penaltyDue;

  const penaltyPaidPreview = Math.min(amount, penaltyDue);
  const afterPenalty = amount - penaltyPaidPreview;

  const interestPaidPreview = Math.min(afterPenalty, interestDue);
  const afterInterest = afterPenalty - interestPaidPreview;

  const principalPaidPreview = Math.min(afterInterest, principal);

  const remainingPrincipalPreview = principal - principalPaidPreview;

  const onSubmit = async (data: CreateRepaymentPayload) => {
    const payload: CreateRepaymentPayload = {
      pawnLoanId: loan.id,
      currencyId: 1,
      paymentMethodId: 1,
      paymentTypeId: 1,

      paidAmount: data.paidAmount,
      principalPaid: principalPaidPreview,
      interestPaid: interestPaidPreview,
      penaltyPaid: penaltyPaidPreview,
      remainingPrincipal: remainingPrincipalPreview,

      receivedBy: 1,
      paymentDate: new Date().toISOString().split('T')[0],
    };

    await createRepayment.mutateAsync(payload);

    queryClient.invalidateQueries({ queryKey: ['pawnLoanDetail', loan.id] });
    queryClient.invalidateQueries({ queryKey: ['pawn-loans'] });

    router.push(`/loans/${loan.id}`);
  };

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold">Record Loan Payment</h1>

      {/* TOTAL CARD */}
      <div className="flex justify-between rounded-xl bg-blue-600 p-6 text-white">
        <div>
          <p className="text-sm opacity-80">TOTAL AMOUNT DUE</p>

          <p className="text-3xl font-bold">
            {loan.currency?.symbol}
            {totalDue.toFixed(2)}
          </p>
        </div>

        <div className="flex gap-4">
          <Stat label="PRINCIPAL" value={principal} />
          <Stat label="INTEREST" value={interestDue} />
        </div>
      </div>

      {/* FORM */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 rounded-xl bg-white p-6 shadow">
        <div>
          <label className="text-sm font-medium">Payment Amount</label>

          <input
            type="number"
            step="0.01"
            {...register('paidAmount', { valueAsNumber: true })}
            className="mt-1 w-full rounded-md border px-3 py-2"
          />

          {errors.paidAmount && <p className="text-sm text-red-500">{errors.paidAmount.message}</p>}
        </div>

        {/* Preview */}
        <div className="space-y-2 border-t pt-4 text-sm">
          <Row label="Principal Paid" value={principalPaidPreview} />
          <Row label="Interest Paid" value={interestPaidPreview} />
          <Row label="Penalty Paid" value={penaltyPaidPreview} />

          <hr />

          <Row label="Remaining Principal" value={remainingPrincipalPreview} blue />
        </div>

        <div className="flex justify-end gap-4">
          <button type="button" onClick={() => router.back()}>
            Cancel
          </button>

          <button type="submit" className="rounded-md bg-blue-600 px-6 py-2 text-white">
            Confirm Payment
          </button>
        </div>
      </form>
    </div>
  );
}

/* UI COMPONENTS */

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg bg-blue-500 px-4 py-2">
      <p className="text-xs opacity-70">{label}</p>
      <p className="font-semibold">${value.toFixed(2)}</p>
    </div>
  );
}

function Row({ label, value, blue }: { label: string; value: number; blue?: boolean }) {
  return (
    <div className={`flex justify-between ${blue ? 'font-semibold text-blue-600' : ''}`}>
      <span>{label}</span>
      <span>${value.toFixed(2)}</span>
    </div>
  );
}
