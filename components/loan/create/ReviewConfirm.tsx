import { ChevronLeft } from 'lucide-react';
import { CustomerForm, ItemForm, LoanForm, BUTTON_STYLES } from './types';

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

  const customerRows = [
    { label: 'Full Name', value: customerForm.fullName || '—' },
    { label: 'Phone', value: customerForm.phone || '—' },
    { label: 'ID Number', value: customerForm.idNumber || '—' },
    { label: 'Address', value: customerForm.address || '—' },
  ];

  const itemRows = [
    { label: 'Item Type', value: itemForm.itemType || '—' },
    { label: 'Description', value: itemForm.description || '—' },
    {
      label: 'Estimated Value',
      value: itemForm.estimatedValue ? `$${itemForm.estimatedValue.toLocaleString()}` : '—',
    },
  ];

  const loanLeftRows = [
    {
      label: 'Loan Amount',
      value: loanForm.loanAmount
        ? `$${Number(loanForm.loanAmount).toLocaleString('en-US', { minimumFractionDigits: 2 })}`
        : '—',
    },
    {
      label: 'Interest Rate',
      value: loanForm.interestRate ? `${loanForm.interestRate}% / month` : '—',
    },
    { label: 'Accrued Interest', value: `$${interest.toFixed(2)}` },
    {
      label: 'Storage Fee',
      value: `$${Number(loanForm.storageFee || 0).toFixed(2)}`,
    },
    {
      label: 'Penalty Rate',
      value: `${Number(loanForm.penaltyRate || 0).toFixed(2)}%`,
    },
  ];

  const loanRightRows = [
    { label: 'Due Date', value: loanForm.dueDate || '—' },
    { label: 'Loan Date', value: today },
    { label: 'Loan Duration', value: `${loanForm.loanDurationDays} days` },
    { label: 'Grace Period', value: `${loanForm.gracePeriodDays} days` },
  ];

  return (
    <div className="space-y-6">
      {/* Customer & Item */}
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
        <div className="border-b border-gray-100 px-6 py-4">
          <h2 className="text-base font-semibold text-gray-900">Customer & Item</h2>
        </div>
        <div className="grid grid-cols-2 gap-6 p-6">
          <div>
            <p className="mb-3 text-xs font-semibold tracking-wide text-gray-400 uppercase">Customer</p>
            <dl className="space-y-2">
              {customerRows.map(row => (
                <div key={row.label} className="flex justify-between">
                  <dt className="text-sm text-gray-500">{row.label}</dt>
                  <dd className="text-sm font-medium text-gray-900">{row.value}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div>
            <p className="mb-3 text-xs font-semibold tracking-wide text-gray-400 uppercase">Pawn Item</p>
            <dl className="space-y-2">
              {itemRows.map(row => (
                <div key={row.label} className="flex justify-between">
                  <dt className="text-sm text-gray-500">{row.label}</dt>
                  <dd className="text-sm font-medium text-gray-900">{row.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      {/* Loan Terms */}
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
        <div className="border-b border-gray-100 px-6 py-4">
          <h2 className="text-base font-semibold text-gray-900">Loan Terms</h2>
        </div>
        <div className="grid grid-cols-2 gap-6 p-6">
          <dl className="space-y-2">
            {loanLeftRows.map(row => (
              <div key={row.label} className="flex justify-between">
                <dt className="text-sm text-gray-500">{row.label}</dt>
                <dd className="text-sm font-medium text-gray-900">{row.value}</dd>
              </div>
            ))}
          </dl>
          <dl className="space-y-2">
            {loanRightRows.map(row => (
              <div key={row.label} className="flex justify-between">
                <dt className="text-sm text-gray-500">{row.label}</dt>
                <dd className="text-sm font-medium text-gray-900">{row.value}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="px-6 pb-6">
          <div className="flex items-center justify-between rounded-md border border-blue-100 bg-blue-50 px-5 py-4">
            <span className="text-sm font-semibold text-blue-700">Total Due at Maturity</span>
            <span className="text-xl font-bold text-blue-700">${total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-2">
        <button className={BUTTON_STYLES.ghost} onClick={onBack}>
          <ChevronLeft className="h-4 w-4" />
          Back
        </button>
        <div className="flex gap-3">
          <button className={BUTTON_STYLES.secondary} onClick={onCancel}>
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isPending}
            className="flex items-center gap-2 rounded-md bg-blue-600 px-6 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending && (
              <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
            )}
            {isPending ? 'Processing...' : 'Confirm & Create Loan'}
          </button>
        </div>
      </div>
    </div>
  );
}
