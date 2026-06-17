'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-red-950/20 p-4">
      <Card className="w-full max-w-md border-2 border-destructive/20 shadow-2xl">
        <CardHeader className="space-y-3 text-center">
          <div className="flex justify-center">
            <div className="bg-destructive/10 text-destructive p-4 rounded-2xl">
              <AlertCircle className="h-10 w-10" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Something went wrong!</CardTitle>
          <CardDescription className="text-base text-muted-foreground">
            {error.message || 'An unexpected error occurred while rendering this page.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Button
            onClick={() => reset()}
            variant="default"
            className="w-full max-w-[200px]"
          >
            Try again
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
