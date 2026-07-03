import { forwardRef, type HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../utils/cn";

const escalationBannerVariants = cva(
  "flex items-start gap-3 p-4 rounded-md border transition-all duration-200 animate-slide-down",
  {
    variants: {
      tier: {
        mild: "bg-amber-50 border-amber-200",
        moderate: "bg-lavender-50 border-lavender-200",
        significant: "bg-rose-50 border-rose-200",
      },
    },
    defaultVariants: {
      tier: "mild",
    },
  },
);

export interface EscalationBannerProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof escalationBannerVariants> {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  onDismiss?: () => void;
  dismissible?: boolean;
  icon?: React.ReactNode;
}

export const EscalationBanner = forwardRef<HTMLDivElement, EscalationBannerProps>(
  (
    {
      className,
      tier,
      title,
      description,
      actionLabel,
      onAction,
      onDismiss,
      dismissible = true,
      icon,
      ...props
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={cn(escalationBannerVariants({ tier, className }))}
        role="alert"
        aria-live="polite"
        {...props}
      >
        <div className="flex-shrink-0 mt-0.5 text-warm-500" aria-hidden="true">
          {icon || (
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-warm-900">{title}</h4>
          <p className="text-sm text-warm-600 mt-1">{description}</p>
          {actionLabel && onAction && (
            <button
              type="button"
              onClick={onAction}
              className="mt-3 text-sm font-medium text-rose-600 hover:text-rose-700 underline-offset-2 hover:underline focus:outline-none focus:ring-2 focus:ring-rose-400 focus:ring-offset-2 rounded"
            >
              {actionLabel}
            </button>
          )}
        </div>
        {dismissible && onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            className="flex-shrink-0 p-1 text-warm-400 hover:text-warm-600 transition-colors focus:outline-none focus:ring-2 focus:ring-rose-400 focus:ring-offset-2 rounded"
            aria-label="Dismiss"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>
    );
  },
);
EscalationBanner.displayName = "EscalationBanner";