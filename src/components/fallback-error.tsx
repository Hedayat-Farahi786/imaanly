import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert';

interface FallbackErrorProps {
  error?: string;
  retry?: () => void;
}

export default function FallbackError({ error, retry }: FallbackErrorProps) {
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription className="flex items-center justify-between">
        <span>{error || 'Something went wrong. Please try again.'}</span>
        {retry && (
          <Button variant="outline" size="sm" onClick={retry}>
            Try Again
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
}