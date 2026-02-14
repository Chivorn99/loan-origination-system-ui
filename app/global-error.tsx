'use client';

import { Button } from '@/components/ui/button';

export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <html>
      <body className='flex h-screen flex-col items-center justify-center gap-4'>
        <h1 className='text-2xl font-bold'>Application Error</h1>
        <p className='text-muted-foreground'>A critical error occurred.</p>

        <Button onClick={reset}>Reload App</Button>
      </body>
    </html>
  );
}
