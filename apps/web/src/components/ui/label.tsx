import { cn } from '@/lib/utils';
import * as LabelPrimitive from '@radix-ui/react-label';
import { type LabelHTMLAttributes, forwardRef } from 'react';

export const Label = forwardRef<HTMLLabelElement, LabelHTMLAttributes<HTMLLabelElement>>(
  ({ className, ...props }, ref) => (
    <LabelPrimitive.Root
      ref={ref}
      className={cn(
        'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
        className
      )}
      {...props}
    />
  )
);
Label.displayName = LabelPrimitive.Root.displayName;
