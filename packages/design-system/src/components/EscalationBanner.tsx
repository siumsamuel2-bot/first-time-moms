import { forwardRef, type HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../utils/cn";

const escalationBannerVariants = cva(
  "flex items-start gap-3 p-4 rounded-md border transition-all duration-300",
  {
    variants: {
      tier: {
        ambient:
          "bg-esc-sage-50 border-esc-sage-100",
        nudge:
          "bg-esc-amber-50 border-esc-amber-100",
        elevated:
          "bg-esc-terracotta-50 border-esc-terracotta-100",
        urgent:
          "bg-esc-berry-50 border-esc-berry-100",
      },
    },
    defaultVariants: {
      tier: "ambient",
    },
  },
);

const iconColors: Record<string, string> = {
  ambient: "text-esc-sage-500",
  nudge: "text-esc-amber-500",
  elevated: "text-esc-terracotta-500",
  urgent: "text-esc-berry-500",
};

const headlineColors: Record<string, string> = {
  ambient: "text-esc-slate-800",
  nudge: "text-esc-slate-800",
  elevated: "text-esc-slate-800",
  urgent: "text-esc-slate-800",
};

const bodyColors: Record<string, string> = {
  ambient: "text-esc-slate-600",
  nudge: "text-esc-slate-600",
  elevated: "text-esc-slate-600",
  urgent: "text-esc-slate-600",
};

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
  secondaryLabel?: string;
  onSecondary?: () => void;
  showClinicianNote?: boolean;
  confirmationRequired?: boolean;
  onConfirmDismiss?: () => void;
}

export const EscalationBanner = forwardRef<HTMLDivElement, EscalationBannerProps>(
  (
    {
      className,
      tier = "ambient",
      title,
      description,
      actionLabel,
      onAction,
      onDismiss,
      dismissible = true,
      icon,
      secondaryLabel,
      onSecondary,
      showClinicianNote = false,
      confirmationRequired = false,
      ...props
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          escalationBannerVariants({ tier, className }),
          tier === "urgent" && "animate-scale-in",
          tier !== "urgent" && "animate-slide-down",
        )}
        role="alert"
        aria-live="polite"
        aria-atomic="true"
        {...props}
      >
        <div className={cn("flex-shrink-0 mt-0.5", iconColors[tier ?? "ambient"])} aria-hidden="true">
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
          <h4 className={cn("text-sm font-semibold", headlineColors[tier ?? "ambient"])}>{title}</h4>
          <p className={cn("text-sm mt-1", bodyColors[tier ?? "ambient"])}>{description}</p>
          <div className="flex items-center gap-3 mt-3 flex-wrap">
            {actionLabel && onAction && (
              <button
                type="button"
                onClick={onAction}
                className="text-sm font-medium text-rose-600 hover:text-rose-700 underline-offset-2 hover:underline focus:outline-none focus:ring-2 focus:ring-rose-400 focus:ring-offset-2 rounded touch-target"
              >
                {actionLabel}
              </button>
            )}
            {secondaryLabel && onSecondary && (
              <button
                type="button"
                onClick={onSecondary}
                className="text-sm text-esc-slate-600 hover:text-esc-slate-800 underline-offset-2 hover:underline focus:outline-none focus:ring-2 focus:ring-esc-slate-400 focus:ring-offset-2 rounded touch-target"
              >
                {secondaryLabel}
              </button>
            )}
          </div>
          {showClinicianNote && (
            <p className="text-xs text-esc-slate-200 mt-2">A clinician has been notified</p>
          )}
        </div>
        {dismissible && onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            className="flex-shrink-0 p-1 text-esc-slate-200 hover:text-esc-slate-600 transition-colors focus:outline-none focus:ring-2 focus:ring-rose-400 focus:ring-offset-2 rounded touch-target"
            aria-label="Dismiss notification"
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
