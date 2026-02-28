'use client';

import { ReactNode } from 'react';

type StatVariant = 'DEFAULT' | 'WARNING' | 'SUCCESS';

type StatCardProps = {
    variant?: StatVariant;
    label: string;
    value: string;
    change?: string;
    subtitle: string;
    icon: ReactNode;
    isLoading?: boolean;
};

const cardStyles: Record<StatVariant, string> = {
    DEFAULT: 'border-gray-200',
    WARNING: 'border-red-400 ring-1 ring-red-400',
    SUCCESS: 'border-gray-200',
};

const iconStyles: Record<StatVariant, string> = {
    DEFAULT: 'bg-blue-50 text-blue-500',
    WARNING: 'bg-red-50 text-red-500',
    SUCCESS: 'bg-green-50 text-green-500',
};

export function StatCard({
    variant = 'DEFAULT',
    label,
    value,
    change,
    subtitle,
    icon,
    isLoading,
}: StatCardProps) {
    if (isLoading) {
        return (
            <div className="flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm animate-pulse">
                <div className="flex items-center justify-between">
                    <div className="h-3 w-24 rounded bg-gray-100" />
                    <div className="h-9 w-9 rounded-xl bg-gray-100" />
                </div>
                <div className="h-8 w-32 rounded bg-gray-100" />
                <div className="h-3 w-20 rounded bg-gray-100" />
            </div>
        );
    }

    return (
        <div className={`flex flex-col gap-3 rounded-2xl border bg-white p-5 shadow-sm ${cardStyles[variant]}`}>
            {/* Label + Icon */}
            <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">
                    {label}
                </span>
                <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${iconStyles[variant]}`}>
                    {icon}
                </span>
            </div>

            <div className="flex items-end gap-2">
                <span className="text-3xl font-bold tracking-tight text-gray-900">{value}</span>
                {change && (
                    <span className="mb-0.5 text-sm font-semibold text-red-500">{change}</span>
                )}
            </div>

            {/* Subtitle */}
            <p className="text-xs text-gray-400">{subtitle}</p>
        </div>
    );
}