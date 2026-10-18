import { cn } from '@/lib/utils';
import * as ProgressPrimitive from '@radix-ui/react-progress';
import { type HTMLAttributes, forwardRef } from 'react';

export const Progress = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement> & { value?: number; max?: number }
>(({ className, value, max = 100, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn('relative h-2 w-full overflow-hidden rounded-full bg-secondary', className)}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className="h-full w-full flex-1 bg-primary-600 transition-all duration-300"
      style={{ transform: `translateX(-${100 - ((value ?? 0) / max) * 100}%)` }}
    />
  </ProgressPrimitive.Root>
));
Progress.displayName = ProgressPrimitive.Root.displayName;
