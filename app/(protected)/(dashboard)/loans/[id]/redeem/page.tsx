'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { usePawnLoanDetail, useRedeemLoan } from '@/hooks/useLoan';
import Image from 'next/image';

export default function RedemptionPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();

  const loanId = params.id;

  const { data, isLoading } = usePawnLoanDetail(loanId);
  const redeemMutation = useRedeemLoan();

  const [verified, setVerified] = useState(false);

  if (isLoading) {
    return <div className="p-6 text-sm text-gray-500">Loading loan details...</div>;
  }

  if (!data) {
    return <div className="p-6 text-sm text-red-500">Loan not found</div>;
  }

  const principal = Number(data.loanAmount);
  const interest = Number(data.totalPayableAmount) - principal;
  const lateFee = 0;
  const previousPayments = 0;

  const total = principal + interest + lateFee - previousPayments;

  const handleRedeem = async () => {
    if (!verified) {
      alert('Please verify item condition');
      return;
    }

    try {
      await redeemMutation.mutateAsync(loanId);

      queryClient.invalidateQueries({ queryKey: ['pawnLoanDetail', loanId] });
      queryClient.invalidateQueries({ queryKey: ['pawn-loans'] });

      router.push(`/loans/${loanId}`);
    } catch (error) {
      console.error(error);
      alert('Failed to redeem loan');
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* TITLE */}
      <div>
        <h1 className="text-2xl font-bold">Redemption Confirmation</h1>
        <p className="text-sm text-gray-500">Verify final payment and item condition</p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* LEFT SIDE */}
        <div className="col-span-2 space-y-6">
          {/* LOAN SUMMARY */}
          <div className="rounded-xl bg-white p-6 shadow">
            <h2 className="mb-4 font-semibold">Loan Settlement Summary</h2>

            <div className="space-y-2 text-sm">
              <Row label="Principal Amount" value={`$${principal.toFixed(2)}`} />

              <Row label="Total Interest" value={`+$${interest.toFixed(2)}`} />

              <Row label="Late Fees" value={`+$${lateFee.toFixed(2)}`} red />

              <Row label="Previous Payments" value={`-$${previousPayments.toFixed(2)}`} green />

              <hr />

              <div className="flex justify-between text-lg font-semibold">
                <span>Total to Pay</span>
                <span className="text-blue-600">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* ITEM VERIFICATION */}
          <div className="rounded-xl bg-white p-6 shadow">
            <h2 className="mb-4 font-semibold">Physical Item Verification</h2>

            <div className="flex gap-4">
              {data.pawnItem?.photoUrl ? (
                <Image src={data.pawnItem.photoUrl} className="h-32 w-32 rounded-lg object-cover" alt="Pawn item" />
              ) : (
                <div className="h-32 w-32 rounded-lg bg-gray-200" />
              )}

              <div>
                <p className="font-medium">{data.pawnItem?.description}</p>

                <p className="text-sm text-gray-500">{data.pawnItem?.itemType}</p>

                <label className="mt-4 flex gap-2 text-sm">
                  <input type="checkbox" checked={verified} onChange={e => setVerified(e.target.checked)} />
                  Item condition verified by customer
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="space-y-6">
          {/* CUSTOMER */}
          <div className="rounded-xl bg-white p-6 shadow">
            <h3 className="mb-2 font-semibold">Customer Authorization</h3>

            <p className="text-sm">{data.customer?.fullName}</p>

            <div className="mt-4 flex h-32 items-center justify-center rounded-md border text-sm text-gray-400">
              Signature Area
            </div>
          </div>

          {/* ACTIONS */}
          <div className="space-y-3 rounded-xl bg-white p-6 shadow">
            <button
              onClick={handleRedeem}
              disabled={redeemMutation.isPending}
              className="w-full rounded-lg bg-blue-600 py-3 text-white"
            >
              {redeemMutation.isPending ? 'Processing...' : 'Confirm Redemption & Close Loan'}
            </button>

            <button onClick={() => router.back()} className="w-full rounded-lg border py-3">
              Back to Loan Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, red, green }: { label: string; value: string; red?: boolean; green?: boolean }) {
  return (
    <div className="flex justify-between">
      <span>{label}</span>
      <span className={red ? 'text-red-500' : green ? 'text-green-600' : ''}>{value}</span>
    </div>
  );
}
