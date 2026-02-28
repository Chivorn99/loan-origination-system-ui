'use client';

import { useParams, useRouter } from 'next/navigation';
import { usePawnLoanDetail } from '@/hooks/useLoan';
import Image from 'next/image';

const formatCurrency = (amount: number | null | undefined, symbol: string | null | undefined) => {
  if (amount == null) return '—';
  return `${symbol ?? ''}${amount.toLocaleString()}`;
};

const formatDate = (date: string | null | undefined) => {
  if (!date) return '—';
  return new Date(date).toLocaleDateString();
};

export default function LoanDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const loanId = params.id;

  const { data, isLoading, isError } = usePawnLoanDetail(loanId);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="grid grid-cols-3 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className={`rounded-xl bg-white p-6 shadow ${i < 3 ? 'col-span-2' : ''}`}>
              <div className="bg-muted mb-4 h-5 w-32 animate-pulse rounded" />
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, j) => (
                  <div key={j} className="bg-muted h-4 w-full animate-pulse rounded" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="rounded-xl bg-white p-10 text-center shadow">
          <p className="text-red-500">Loan not found</p>
          <button onClick={() => router.back()} className="mt-4 text-sm text-blue-600 hover:underline">
            Go back
          </button>
        </div>
      </div>
    );
  }

  const currencySymbol = data.currency?.symbol;
  const interest = data.totalPayableAmount != null ? data.totalPayableAmount - data.loanAmount : null;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="flex h-11 w-11 items-center justify-center rounded-full border bg-white text-lg shadow-sm transition hover:bg-gray-100"
          >
            ‹
          </button>
          <div>
            <h1 className="text-2xl font-bold">Loan #{data.loanCode}</h1>
            {data.status === 'DEFAULTED' && (
              <span className="mt-1 inline-block rounded-full bg-red-100 px-3 py-1 text-xs text-red-600">
                DEFAULTED
              </span>
            )}
            {data.status === 'OVERDUE' && (
              <span className="mt-1 inline-block rounded-full bg-orange-100 px-3 py-1 text-xs text-orange-600">
                OVERDUE
              </span>
            )}
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => router.push(`/loans/${loanId}/redeem`)}
            className="rounded-lg bg-gray-200 px-4 py-2 text-sm"
          >
            Redeem Item
          </button>
          <button
            onClick={() => router.push(`/loans/${loanId}/payment`)}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white shadow hover:bg-blue-700"
          >
            Record Payment
          </button>
        </div>
      </div>

      {/* Layout */}
      <div className="grid grid-cols-3 gap-6">
        {/* LEFT */}
        <div className="col-span-2 space-y-6">
          {/* Loan Summary */}
          <div className="rounded-xl bg-white p-6 shadow">
            <h2 className="mb-4 text-lg font-semibold">Loan Summary</h2>
            <div className="grid grid-cols-2 gap-4">
              <Info label="Customer" value={data.customer?.fullName} />
              <Info label="Phone" value={data.customer?.phone} />
              <Info label="Loan Amount" value={formatCurrency(data.loanAmount, currencySymbol)} />
              <Info label="Interest Rate" value={`${data.interestRate}%`} />
              <Info label="Loan Date" value={formatDate(data.loanDate)} />
              <Info label="Due Date" value={formatDate(data.dueDate)} />
              {data.gracePeriodEndDate && (
                <Info label="Grace Period Ends" value={formatDate(data.gracePeriodEndDate)} />
              )}
              {data.redemptionDeadline && (
                <Info label="Redemption Deadline" value={formatDate(data.redemptionDeadline)} />
              )}
            </div>
          </div>

          <div className="rounded-xl bg-white p-6 shadow">
            <h2 className="mb-4 text-lg font-semibold">Collateral Item</h2>
            {data.pawnItem ? (
              <div className="flex gap-6">
                {data.pawnItem.photoUrl ? (
                  <Image src={data.pawnItem.photoUrl} alt="Collateral" className="h-28 w-28 rounded-lg object-cover" />
                ) : (
                  <div className="flex h-28 w-28 items-center justify-center rounded-lg bg-gray-200 text-sm text-gray-500">
                    No Image
                  </div>
                )}
                <div className="flex-1 space-y-2">
                  <Info label="Description" value={data.pawnItem.description} />
                  <Info label="Type" value={data.pawnItem.itemType} />
                  <Info label="Estimated Value" value={formatCurrency(data.pawnItem.estimatedValue, currencySymbol)} />
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-500">No collateral information available.</p>
            )}
          </div>
        </div>
        <div className="space-y-6">
          <div className="rounded-xl bg-white p-6 shadow">
            <h2 className="mb-4 text-lg font-semibold">Financial Breakdown</h2>
            <div className="space-y-3 text-sm">
              <Row label="Principal" value={formatCurrency(data.loanAmount, currencySymbol)} />
              <Row label="Interest" value={formatCurrency(interest, currencySymbol)} />
              {data.storageFee != null && data.storageFee > 0 && (
                <Row label="Storage Fee" value={formatCurrency(data.storageFee, currencySymbol)} />
              )}
              <hr />
              <Row label="Total Payable" value={formatCurrency(data.totalPayableAmount, currencySymbol)} bold />
            </div>
          </div>

          <div className="rounded-xl bg-white p-6 shadow">
            <h2 className="mb-4 text-lg font-semibold">Loan Details</h2>
            <div className="space-y-2 text-sm">
              <Row label="Branch" value={data.branch?.name} />
              <Row label="Status" value={data.status} />
              <Row label="Duration" value={data.loanDurationDays != null ? `${data.loanDurationDays} days` : '—'} />
              <Row label="Grace Period" value={data.gracePeriodDays != null ? `${data.gracePeriodDays} days` : '—'} />
              <Row label="Frequency" value={data.paymentFrequency ?? '—'} />
              {data.numberOfInstallments != null && data.numberOfInstallments > 1 && (
                <Row
                  label="Installments"
                  value={`${data.numberOfInstallments}x ${formatCurrency(data.installmentAmount, currencySymbol)}`}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div>
      <div className="text-xs text-gray-500">{label}</div>
      <div className="font-medium">{value ?? '—'}</div>
    </div>
  );
}

function Row({ label, value, bold }: { label: string; value: string | null | undefined; bold?: boolean }) {
  return (
    <div className="flex justify-between">
      <span className="text-gray-500">{label}</span>
      <span className={bold ? 'font-bold text-blue-600' : ''}>{value ?? '—'}</span>
    </div>
  );
}
