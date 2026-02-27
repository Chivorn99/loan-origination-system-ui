interface RepaymentSummaryProps {
  loanAmount: string;
  interest: number;
  total: number;
}

export default function RepaymentSummary({ loanAmount, interest, total }: RepaymentSummaryProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
      <div className="border-b border-gray-100 px-6 py-4">
        <h2 className="text-base font-semibold text-gray-900">Repayment Summary</h2>
      </div>
      <div className="p-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Principal</span>
            <span className="text-sm font-medium text-gray-900">
              ${Number(loanAmount || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Accrued Interest</span>
            <span className="text-sm font-medium text-gray-900">${interest.toFixed(2)}</span>
          </div>
          <div className="h-px bg-gray-100" />
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-900">Total Due</span>
            <span className="text-base font-bold text-blue-600">${total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
