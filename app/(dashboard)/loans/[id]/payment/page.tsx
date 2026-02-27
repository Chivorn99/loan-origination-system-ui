'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { usePawnLoanDetail } from '@/hooks/useLoan';
import { useCreateRepayment } from '@/hooks/useRepayment';

export default function RecordPaymentPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const loanId = params.id;
  const { data: loan } = usePawnLoanDetail(loanId);

  const createRepayment = useCreateRepayment();

  const [amount, setAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<number>(1);

  if (!loan) return null;

  const principal = Number(loan.loanAmount);
  const interestDue = Number(loan.totalPayableAmount) - principal;

  const penaltyDue = 0; // adjust if your backend calculates separately

  const totalDue = principal + interestDue + penaltyDue;

  /* -------------------------------- */
  /* PREVIEW CALCULATION */
  /* -------------------------------- */

  const penaltyPaidPreview = Math.min(amount, penaltyDue);
  const afterPenalty = amount - penaltyPaidPreview;

  const interestPaidPreview = Math.min(afterPenalty, interestDue);
  const afterInterest = afterPenalty - interestPaidPreview;

  const principalPaidPreview = Math.min(afterInterest, principal);

  const remainingPrincipalPreview = principal - principalPaidPreview;

  const handleSubmit = async () => {
    if (amount <= 0) {
      alert('Payment must be greater than 0');
      return;
    }

    let remaining = amount;

    const penaltyPaid = Math.min(remaining, penaltyDue);
    remaining -= penaltyPaid;

    const interestPaid = Math.min(remaining, interestDue);
    remaining -= interestPaid;

    const principalPaid = Math.min(remaining, principal);
    remaining -= principalPaid;

    const remainingPrincipal = principal - principalPaid;

    if (remainingPrincipal <= 0) {
      alert('Full repayment must use redeem endpoint (remaining principal cannot be 0)');
      return;
    }

    await createRepayment.mutateAsync({
      pawnLoanId: loan.id,
      currencyId: loan.currency.id,
      paymentMethodId: paymentMethod,
      paymentTypeId: 1,

      paidAmount: Number(amount.toFixed(2)),
      principalPaid: Number(principalPaid.toFixed(2)),
      interestPaid: Number(interestPaid.toFixed(2)),
      penaltyPaid: Number(penaltyPaid.toFixed(2)),
      remainingPrincipal: Number(remainingPrincipal.toFixed(2)),

      receivedBy: 1,
      paymentDate: new Date().toISOString().split('T')[0],
    });

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
            {loan.currency.symbol}
            {totalDue.toFixed(2)}
          </p>

          <p className="text-sm opacity-80">
            Loan #{loan.loanCode} · {loan.customer.fullName}
          </p>
        </div>

        <div className="flex gap-4">
          <Stat label="PRINCIPAL" value={principal} />
          <Stat label="INTEREST" value={interestDue} />
        </div>
      </div>

      {/* FORM */}
      <div className="space-y-6 rounded-xl bg-white p-6 shadow">
        <Input label="Payment Amount" value={amount} onChange={setAmount} />

        <div>
          <label className="text-sm font-medium">Payment Method</label>

          <select
            value={paymentMethod}
            onChange={e => setPaymentMethod(Number(e.target.value))}
            className="mt-1 w-full rounded-md border px-3 py-2"
          >
            <option value={1}>Cash</option>
            <option value={2}>Bank Transfer</option>
            <option value={3}>Card</option>
          </select>
        </div>

        <div className="space-y-2 border-t pt-4 text-sm">
          <Row label="Principal Paid" value={principalPaidPreview} />
          <Row label="Interest Paid" value={interestPaidPreview} />
          <Row label="Penalty Paid" value={penaltyPaidPreview} />

          <hr />

          <Row label="Remaining Principal" value={remainingPrincipalPreview} blue />
        </div>

        <div className="flex justify-end gap-4">
          <button onClick={() => router.back()} className="text-gray-600">
            Cancel
          </button>

          <button onClick={handleSubmit} className="rounded-md bg-blue-600 px-6 py-2 text-white">
            Confirm Payment
          </button>
        </div>
      </div>
    </div>
  );
}

/* COMPONENTS */

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

function Input({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div>
      <label className="text-sm font-medium">{label}</label>

      <input
        type="number"
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="mt-1 w-full rounded-md border px-3 py-2"
      />
    </div>
  );
}
