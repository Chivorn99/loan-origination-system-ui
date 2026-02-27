import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ItemForm, BUTTON_STYLES } from './types';

interface ItemStepProps {
  form: ItemForm;
  onChange: (form: ItemForm) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function ItemStep({ form, onChange, onNext, onBack }: ItemStepProps) {
  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
        <div className="border-b border-gray-100 px-6 py-4">
          <h2 className="text-base font-semibold text-gray-900">Pawn Item</h2>
          <p className="mt-0.5 text-sm text-gray-500">Describe the collateral being pawned</p>
        </div>
        <div className="grid grid-cols-2 gap-5 p-6">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700">Item Type</label>
            <input
              type="text"
              placeholder="e.g. Jewelry, Electronics"
              value={form.itemType}
              onChange={e => onChange({ ...form, itemType: e.target.value })}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700">Estimated Value ($)</label>
            <input
              type="number"
              placeholder="0.00"
              value={form.estimatedValue || ''}
              onChange={e => onChange({ ...form, estimatedValue: Number(e.target.value) })}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div className="col-span-2 space-y-1.5">
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <input
              type="text"
              placeholder="Brief description of the item"
              value={form.description}
              onChange={e => onChange({ ...form, description: e.target.value })}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div className="col-span-2 space-y-1.5">
            <label className="block text-sm font-medium text-gray-700">Photo URL</label>
            <input
              type="text"
              placeholder="https://..."
              value={form.photoUrl}
              onChange={e => onChange({ ...form, photoUrl: e.target.value })}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

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
