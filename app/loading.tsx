import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className="flex min-h-screen justify-center px-4 pt-24">
      <div className="w-full max-w-3xl space-y-6">
        <Skeleton className="h-8 w-1/3" />

        <div className="space-y-4 rounded-lg border p-6">
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>

        <div className="space-y-3">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    </div>
  );
}
