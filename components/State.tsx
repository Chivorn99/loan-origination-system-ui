import { Loader2 } from 'lucide-react';

type Props = {
  isLoading?: boolean;
  error?: Error | string | null;
  isEmpty?: boolean;
  emptyMessage?: string;
  errorMessage?: string;
  children: React.ReactNode;
};

export function State({
  isLoading,
  error,
  isEmpty,
  emptyMessage = 'No data available',
  errorMessage = 'Something went wrong',
  children,
}: Props) {
  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="text-primary h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-destructive flex justify-center py-10 text-sm">
        {typeof error === 'string' ? error : error.message || errorMessage}
      </div>
    );
  }

  if (isEmpty) {
    return <div className="text-muted-foreground flex justify-center py-10 text-sm">{emptyMessage}</div>;
  }

  return <>{children}</>;
}
