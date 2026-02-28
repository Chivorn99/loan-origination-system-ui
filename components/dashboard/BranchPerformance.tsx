'use client';

type ProgressBarProps = {
    label: string;
    value: number;
    color: string;
};

function ProgressBar({ label, value, color }: ProgressBarProps) {
    return (
        <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">{label}</span>
                <span className="font-semibold text-gray-800">{value}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${value}%`, backgroundColor: color }}
                />
            </div>
        </div>
    );
}

type Props = {
    loanRecoveryRate?: number;
    customerRetentionRate?: number;
    isLoading?: boolean;
};

export function BranchPerformance({ loanRecoveryRate = 0, customerRetentionRate = 0, isLoading }: Props) {
    return (
        <div className="flex flex-col gap-5 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-base font-semibold text-gray-900">Branch Performance</h2>

            {isLoading ? (
                <div className="flex flex-col gap-4 animate-pulse">
                    {[1, 2].map(i => (
                        <div key={i} className="flex flex-col gap-2">
                            <div className="flex justify-between">
                                <div className="h-4 w-32 rounded bg-gray-100" />
                                <div className="h-4 w-10 rounded bg-gray-100" />
                            </div>
                            <div className="h-2 w-full rounded-full bg-gray-100" />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col gap-4">
                    <ProgressBar label="Loan Recovery Rate" value={loanRecoveryRate} color="#3b82f6" />
                    <ProgressBar label="Customer Retention" value={customerRetentionRate} color="#22c55e" />
                </div>
            )}
        </div>
    );
}