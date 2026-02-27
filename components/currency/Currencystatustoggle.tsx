'use client';

type Props = {
    status: string;
    onChange: () => void;
    loading?: boolean;
};

export function CurrencyStatusToggle({ status, onChange, loading = false }: Props) {
    const isActive = status === 'ACTIVE';

    return (
        <button
            onClick={onChange}
            disabled={loading}
            aria-label="Toggle status"
            className="flex items-center gap-2 disabled:opacity-50"
        >
            <span
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 ${isActive ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
            >
                <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${isActive ? 'translate-x-6' : 'translate-x-1'
                        }`}
                />
            </span>
            <span className={`text-sm ${isActive ? 'text-gray-800' : 'text-gray-400'}`}>
                {isActive ? 'Active' : 'Inactive'}
            </span>
        </button>
    );
}