import { ChevronRight } from 'lucide-react';
import { CustomerForm, BUTTON_STYLES } from './types';

interface CustomerStepProps {
  form: CustomerForm;
  onChange: (form: CustomerForm) => void;
  onNext: () => void;
  onCancel: () => void;
}

export default function CustomerStep({ form, onChange, onNext, onCancel }: CustomerStepProps) {
  const fields: { key: keyof CustomerForm; label: string; placeholder: string }[] = [
    { key: 'fullName', label: 'Full Name', placeholder: 'e.g. John Smith' },
    { key: 'phone', label: 'Phone Number', placeholder: 'e.g. +1 555 000 1234' },
    { key: 'idNumber', label: 'ID Number', placeholder: 'National ID or Passport' },
    { key: 'address', label: 'Address', placeholder: 'Street, City, Country' },
  ];

  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
        <div className="border-b border-gray-100 px-6 py-4">
          <h2 className="text-base font-semibold text-gray-900">Customer Information</h2>
          <p className="mt-0.5 text-sm text-gray-500">Enter the borrower personal details</p>
        </div>
        <div className="grid grid-cols-2 gap-5 p-6">
          {fields.map(({ key, label, placeholder }) => (
            <div key={key} className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">{label}</label>
              <input
                type="text"
                placeholder={placeholder}
                value={form[key] as string}
                onChange={e => onChange({ ...form, [key]: e.target.value })}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-3">
        <button className={BUTTON_STYLES.secondary} onClick={onCancel}>
          Cancel
        </button>
        <button className={BUTTON_STYLES.primary} onClick={onNext}>
          Next
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
