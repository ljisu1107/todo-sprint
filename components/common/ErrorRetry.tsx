import Button from '@/components/ui/button/Button';

interface ErrorRetryProps {
  message: string;
  onRetry: () => void;
}

const ErrorRetry = ({ message, onRetry }: ErrorRetryProps) => (
  <div className="flex flex-col items-center gap-2 py-4">
    <p className="text-muted">{message}</p>
    <Button variant="neutral" size="sm" className="w-auto" onClick={onRetry}>
      다시 시도
    </Button>
  </div>
);

export default ErrorRetry;
