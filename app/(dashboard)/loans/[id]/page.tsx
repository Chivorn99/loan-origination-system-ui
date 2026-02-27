'use client';

import { useParams, useRouter } from 'next/navigation';
import { usePawnLoanDetail, useRedeemLoan, useDefaultLoan } from '@/hooks/useLoan';

const formatCurrency = (amount: number, symbol: string) => {
  return `${symbol}${amount.toLocaleString()}`;
};

const formatDate = (date: string | null | undefined) => {
  if (!date) return '-';
  return new Date(date).toLocaleDateString();
};

export default function LoanDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const loanId = params.id;

  const { data, isLoading, isError } = usePawnLoanDetail(loanId);

  const redeemMutation = useRedeemLoan();
  const defaultMutation = useDefaultLoan();

  if (isLoading) {
    return <div className="p-10 text-center">Loading...</div>;
  }

  if (isError || !data) {
    return <div className="p-10 text-center text-red-500">Loan not found</div>;
  }

  const currency = data.currency.symbol;

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
              <span className="mt-1 inline-block rounded-full bg-red-100 px-3 py-1 text-xs text-red-600">OVERDUE</span>
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
        {/* LEFT SIDE */}
        <div className="col-span-2 space-y-6">
          {/* Loan Summary */}
          <div className="rounded-xl bg-white p-6 shadow">
            <h2 className="mb-4 text-lg font-semibold">Loan Summary</h2>

            <div className="grid grid-cols-2 gap-4">
              <Info label="Customer" value={data.customer.fullName} />
              <Info label="Phone" value={data.customer.phone} />
              <Info label="Loan Amount" value={formatCurrency(data.loanAmount, currency)} />
              <Info label="Interest Rate" value={`${data.interestRate}%`} />
              <Info label="Loan Date" value={formatDate(data.loanDate)} />
              <Info label="Due Date" value={formatDate(data.dueDate)} />
            </div>
          </div>

          {/* Collateral */}
          <div className="rounded-xl bg-white p-6 shadow">
            <h2 className="mb-4 text-lg font-semibold">Collateral Item</h2>

            <div className="flex gap-6">
              {data.pawnItem.photoUrl ? (
                <img src={data.pawnItem.photoUrl} className="h-28 w-28 rounded-lg object-cover" />
              ) : (
                <div className="flex h-28 w-28 items-center justify-center rounded-lg bg-gray-200 text-sm text-gray-500">
                  No Image
                </div>
              )}

              <div className="flex-1 space-y-2">
                <Info label="Description" value={data.pawnItem.description} />
                <Info label="Type" value={data.pawnItem.itemType} />
                <Info label="Estimated Value" value={formatCurrency(data.pawnItem.estimatedValue, currency)} />
              </div>
            </div>
          </div>

          {/* Payment History (placeholder) */}
          <div className="rounded-xl bg-white p-6 shadow">
            <h2 className="mb-4 text-lg font-semibold">Payment History</h2>

            <div className="text-sm text-gray-500">No payment history available yet.</div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="space-y-6">
          {/* Financial Breakdown */}
          <div className="rounded-xl bg-white p-6 shadow">
            <h2 className="mb-4 text-lg font-semibold">Financial Breakdown</h2>

            <div className="space-y-3 text-sm">
              <Row label="Principal" value={formatCurrency(data.loanAmount, currency)} />
              <Row label="Interest" value={formatCurrency(data.totalPayableAmount - data.loanAmount, currency)} />
              <hr />
              <Row label="Total Payable" value={formatCurrency(data.totalPayableAmount, currency)} bold />
            </div>
          </div>

          {/* Loan Info */}
          <div className="rounded-xl bg-white p-6 shadow">
            <h2 className="mb-4 text-lg font-semibold">Loan Details</h2>

            <div className="space-y-2 text-sm">
              <Row label="Branch" value={data.branch.name} />
              <Row label="Branch Phone" value={data.branch.phone} />
              <Row label="Status" value={data.status} />
            </div>
          </div>

          {/* Default Button */}
          <button
            onClick={() => defaultMutation.mutate(loanId)}
            className="w-full rounded-lg bg-red-600 py-3 text-white hover:bg-red-700"
          >
            Mark Default
          </button>
        </div>
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs text-gray-500">{label}</div>
      <div className="font-medium">{value}</div>
    </div>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex justify-between">
      <span className="text-gray-500">{label}</span>
      <span className={bold ? 'font-bold text-blue-600' : ''}>{value}</span>
    </div>
  );
}
