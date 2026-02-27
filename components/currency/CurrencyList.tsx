'use client';

import { useEffect, useMemo, useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { type Currency } from '@/validations/currency';
import { useCurrencies } from '@/hooks/useCurrency';
import { currencyService } from '@/services/currencyService';
import { CurrencyFilter } from '@/components/currency/CurrencyFilter';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { State } from '@/components/State';
import { CurrencyStatusToggle } from './Currencystatustoggle';
import { CurrencyFormModal } from './Currencyformmodal';

type Props = {
  triggerCreate?: boolean;
  onCreateHandled?: () => void;
};

export function CurrencyList({ triggerCreate, onCreateHandled }: Props) {
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');
  const [togglingId, setTogglingId] = useState<number | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingCurrency, setEditingCurrency] = useState<Currency | null>(null);

  const size = 10;
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useCurrencies(page, size);

  const currencies: Currency[] = useMemo(() => data?.content ?? [], [data?.content]);
  const totalElements = data?.totalElements ?? 0;
  const totalPages = data?.totalPages ?? 0;
  const currentPage = data?.number ?? 0;

  useEffect(() => {
    if (triggerCreate) {
      setEditingCurrency(null);
      setModalOpen(true);
      onCreateHandled?.();
    }
  }, [triggerCreate, onCreateHandled]);

  const filteredCurrencies = useMemo(() => {
    const s = search.trim().toLowerCase();
    return currencies.filter(
      c =>
        !s || c.code.toLowerCase().includes(s) || c.name.toLowerCase().includes(s) || c.symbol.toLowerCase().includes(s)
    );
  }, [currencies, search]);

  const displayedCount = filteredCurrencies.length;
  const start = displayedCount ? currentPage * size + 1 : 0;
  const end = displayedCount ? start + displayedCount - 1 : 0;

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['currencies'] });

  const handleSearch = (value: string) => {
    setSearch(value);
    // setPage(0);
  };

  const handleEdit = (currency: Currency) => {
    setEditingCurrency(currency);
    setModalOpen(true);
  };

  const handleToggleStatus = async (currency: Currency) => {
    const newStatus = currency.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    setTogglingId(currency.id);
    try {
      await currencyService.patch(currency.id, { status: newStatus });
      invalidate();
    } finally {
      setTogglingId(null);
    }
  };

  const handleDelete = async (currency: Currency) => {
    if (!confirm(`Are you sure to inactivate ${currency.code} code?`)) return;
    await currencyService.delete(currency.id);
    invalidate();
  };

  return (
    <State
      isLoading={isLoading}
      error={error}
      isEmpty={!displayedCount}
      emptyMessage="No currencies found"
      errorMessage="Failed to load currencies"
    >
      <div className="flex flex-col gap-4">
        <CurrencyFilter search={search} onSearch={handleSearch} onExport={() => {}} onFilter={() => {}} />

        <div className="bg-background overflow-hidden rounded-2xl border shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>CODE</TableHead>
                <TableHead>NAME</TableHead>
                <TableHead>SYMBOL</TableHead>
                <TableHead>DECIMAL PLACES</TableHead>
                <TableHead>STATUS</TableHead>
                <TableHead className="text-right">ACTIONS</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredCurrencies.map(currency => (
                <TableRow key={currency.id} className="hover:bg-muted/40">
                  <TableCell>
                    <span className="font-semibold tracking-wide text-blue-600">{currency.code}</span>
                  </TableCell>

                  <TableCell>{currency.name}</TableCell>

                  <TableCell>
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-gray-50 text-sm font-semibold text-gray-700">
                      {currency.symbol}
                    </span>
                  </TableCell>

                  <TableCell>{currency.decimalPlace}</TableCell>

                  <TableCell>
                    <CurrencyStatusToggle
                      status={currency.status}
                      onChange={() => handleToggleStatus(currency)}
                      loading={togglingId === currency.id}
                    />
                  </TableCell>

                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-3">
                      <button
                        onClick={() => handleEdit(currency)}
                        className="text-gray-400 transition-colors hover:text-blue-600"
                        aria-label="Edit"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => handleDelete(currency)}
                        className="text-gray-400 transition-colors hover:text-red-500"
                        aria-label="Delete"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="flex items-center justify-between border-t px-6 py-4 text-sm">
            <div className="text-muted-foreground">
              {displayedCount
                ? `Showing ${start}–${end} of ${totalElements} currencies`
                : `Showing 0 of ${totalElements} currencies`}
            </div>

            <div className="flex gap-2">
              <button
                disabled={currentPage === 0}
                onClick={() => setPage(p => p - 1)}
                className="rounded-md border px-3 py-1 disabled:opacity-40"
              >
                ‹
              </button>

              {Array.from({ length: totalPages }).map((_, i) => {
                const isActive = i === currentPage;
                return (
                  <button
                    key={i}
                    onClick={() => setPage(i)}
                    className={`rounded-md border px-3 py-1 ${
                      isActive ? 'border-blue-600 bg-blue-600 text-white' : 'hover:bg-muted'
                    }`}
                  >
                    {i + 1}
                  </button>
                );
              })}

              <button
                disabled={currentPage === totalPages - 1}
                onClick={() => setPage(p => p + 1)}
                className="rounded-md border px-3 py-1 disabled:opacity-40"
              >
                ›
              </button>
            </div>
          </div>
        </div>
        {modalOpen && (
          <CurrencyFormModal
            currency={editingCurrency}
            onClose={() => {
              setModalOpen(false);
              setEditingCurrency(null);
            }}
            onSuccess={invalidate}
          />
        )}
      </div>
    </State>
  );
}
