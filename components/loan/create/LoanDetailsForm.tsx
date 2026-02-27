import { ChevronLeft, ChevronRight } from 'lucide-react';
import RepaymentSummary from './RepaymentSummary';
import { Branch } from '@/validations/branch';
import { Currency } from '@/validations/currency';
import { LoanForm, ItemForm, BUTTON_STYLES } from './types';

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
  const handleQuickDate = (days: number) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    onChange({
      ...form,
      dueDate: date.toISOString().split('T')[0],
      loanDurationDays: days,
    });
  };

  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
        <div className="border-b border-gray-100 px-6 py-4">
          <h2 className="text-base font-semibold text-gray-900">Financial Terms</h2>
          <p className="mt-0.5 text-sm text-gray-500">Specify the amount, interest rates, and duration for this loan</p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-2 gap-6">
            {/* Left column */}
            <div className="space-y-5">
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700">Currency</label>
                <select
                  value={form.currencyId}
                  onChange={e => onChange({ ...form, currencyId: Number(e.target.value) })}
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="">Select currency</option>
                  {currenciesLoading && <option disabled>Loading...</option>}
                  {currencies?.map(currency => (
                    <option key={currency.id} value={currency.id}>
                      {currency.code} — {currency.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700">Loan Amount</label>
                <div className="relative">
                  <span className="absolute top-1/2 left-3 -translate-y-1/2 text-sm text-gray-400">$</span>
                  <input
                    type="number"
                    placeholder="0.00"
                    value={form.loanAmount}
                    onChange={e => onChange({ ...form, loanAmount: e.target.value })}
                    className="w-full rounded-md border border-gray-300 py-2 pr-3 pl-7 text-sm text-gray-900 placeholder-gray-400 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                {itemForm.estimatedValue > 0 && (
                  <p className="text-xs text-gray-400">
                    Suggested max for this item: $
                    {(itemForm.estimatedValue * 0.8).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700">Interest Rate (Monthly %)</label>
                <div className="relative">
                  <input
                    type="number"
                    placeholder="0.00"
                    value={form.interestRate}
                    onChange={e => onChange({ ...form, interestRate: e.target.value })}
                    className="w-full rounded-md border border-gray-300 py-2 pr-8 pl-3 text-sm text-gray-900 placeholder-gray-400 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  <span className="absolute top-1/2 right-3 -translate-y-1/2 text-sm text-gray-400">%</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700">Storage Fee ($)</label>
                <div className="relative">
                  <span className="absolute top-1/2 left-3 -translate-y-1/2 text-sm text-gray-400">$</span>
                  <input
                    type="number"
                    placeholder="0.00"
                    min={0}
                    value={form.storageFee}
                    onChange={e => onChange({ ...form, storageFee: Number(e.target.value) })}
                    className="w-full rounded-md border border-gray-300 py-2 pr-3 pl-7 text-sm text-gray-900 placeholder-gray-400 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Right column */}
            <div className="space-y-5">
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700">Branch</label>
                <select
                  value={form.branchId}
                  onChange={e => onChange({ ...form, branchId: Number(e.target.value) })}
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="">Select branch</option>
                  {branchesLoading && <option disabled>Loading...</option>}
                  {branches?.map(branch => (
                    <option key={branch.id} value={branch.id}>
                      {branch.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700">Loan Date</label>
                <input
                  type="date"
                  defaultValue={new Date().toISOString().split('T')[0]}
                  disabled
                  className="w-full cursor-not-allowed rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700">Due Date</label>
                <input
                  type="date"
                  value={form.dueDate}
                  onChange={e => onChange({ ...form, dueDate: e.target.value })}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                <div className="mt-2 flex gap-2">
                  {[30, 60, 90].map(days => (
                    <button
                      key={days}
                      type="button"
                      onClick={() => handleQuickDate(days)}
                      className="rounded border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600 transition-colors hover:bg-blue-100"
                    >
                      +{days} Days
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700">Penalty Rate (%)</label>
                <div className="relative">
                  <input
                    type="number"
                    placeholder="0.00"
                    min={0}
                    value={form.penaltyRate}
                    onChange={e => onChange({ ...form, penaltyRate: Number(e.target.value) })}
                    className="w-full rounded-md border border-gray-300 py-2 pr-8 pl-3 text-sm text-gray-900 placeholder-gray-400 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  <span className="absolute top-1/2 right-3 -translate-y-1/2 text-sm text-gray-400">%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <RepaymentSummary loanAmount={form.loanAmount} interest={interest} total={total} />

      <div className="mt-6 flex justify-between gap-3">
        <button className={BUTTON_STYLES.ghost} onClick={onBack}>
          <ChevronLeft className="h-4 w-4" />
          Back
        </button>
        <button className={BUTTON_STYLES.primary} onClick={onNext}>
          Next
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
