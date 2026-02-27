'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, X } from 'lucide-react';

import { CurrencyRequestSchema, type Currency, type CurrencyRequest } from '@/validations/currency';
import { z } from 'zod';
import { currencyService } from '@/services/currencyService';

type Props = {
  currency?: Currency | null;
  onClose: () => void;
  onSuccess: () => void;
};

export function CurrencyFormModal({ currency, onClose, onSuccess }: Props) {
  const isEdit = !!currency;
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CurrencyRequest>({
    resolver: zodResolver(
      CurrencyRequestSchema.extend({
        decimalPlace: z.number().min(0).max(8),
        status: z.enum(['ACTIVE', 'INACTIVE', 'DELETED']),
      })
    ),
    defaultValues: {
      code: '',
      name: '',
      symbol: '',
      decimalPlace: 2,
      status: 'ACTIVE',
    },
  });

  useEffect(() => {
    if (currency) {
      reset({
        code: currency.code,
        name: currency.name,
        symbol: currency.symbol,
        decimalPlace: currency.decimalPlace,
        status: currency.status,
      });
    } else {
      reset({ code: '', name: '', symbol: '', decimalPlace: 2, status: 'ACTIVE' });
    }
  }, [currency, reset]);

  const onSubmit = async (data: CurrencyRequest) => {
    setServerError(null);
    try {
      if (isEdit && currency) {
        await currencyService.update(currency.id, data);
      } else {
        await currencyService.create(data);
      }
      onSuccess();
      onClose();
    } catch (err) {
      setServerError((err as Error).message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-background w-full max-w-md rounded-2xl border p-6 shadow-xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">{isEdit ? 'Edit Currency' : 'Add New Currency'}</h2>
            <p className="text-muted-foreground text-sm">
              {isEdit ? `Editing ${currency.code} — ${currency.name}` : 'Fill in the details to create a new currency.'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground rounded-lg p-1 transition-colors"
          >
            <X size={18} />
          </button>
        </div>
        {serverError && (
          <div className="mb-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-600">
            <AlertCircle size={15} className="shrink-0" />
            {serverError}
          </div>
        )}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Code</label>
            <input
              {...register('code')}
              placeholder="e.g. USD"
              disabled={isEdit}
              className="w-full rounded-xl border bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-400"
            />
            {errors.code && <p className="mt-1 text-xs text-red-500">{errors.code.message}</p>}
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Name</label>
            <input
              {...register('name')}
              placeholder="e.g. US Dollar"
              className="w-full rounded-xl border bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500"
            />
            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Symbol</label>
            <input
              {...register('symbol')}
              placeholder="e.g. $"
              className="w-full rounded-xl border bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500"
            />
            {errors.symbol && <p className="mt-1 text-xs text-red-500">{errors.symbol.message}</p>}
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Decimal Places</label>
            <input
              {...register('decimalPlace', { valueAsNumber: true })}
              type="number"
              min={0}
              max={8}
              placeholder="2"
              className="w-full rounded-xl border bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500"
            />
            {errors.decimalPlace && <p className="mt-1 text-xs text-red-500">{errors.decimalPlace.message}</p>}
          </div>
          {isEdit && (
            <div>
              <label className="mb-1 block text-sm font-medium">Status</label>
              <select
                {...register('status')}
                className="w-full rounded-xl border bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500"
              >
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
              {errors.status && <p className="mt-1 text-xs text-red-500">{errors.status.message}</p>}
            </div>
          )}
          <div className="mt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
            >
              {isSubmitting ? (isEdit ? 'Saving...' : 'Creating...') : isEdit ? 'Save Changes' : 'Create Currency'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
