'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex h-screen items-center justify-center px-4">
      <Alert className="max-w-md">
        <AlertTitle>Something went wrong</AlertTitle>
        <AlertDescription className="mb-4">
          An unexpected error occurred. Please try again.
        </AlertDescription>

        <Button size="lg" onClick={reset}>
          Try again
        </Button>
      </Alert>
    </div>
  );
}
