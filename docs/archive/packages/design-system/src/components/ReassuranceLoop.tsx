import { type HTMLAttributes } from "react";
import { cn } from "../utils/cn";

export type ReassuranceKind =
  | "post-submission"
  | "next-day-followup"
  | "milestone"
  | "positive-checkin"
  | "provider-followup";

export interface ReassuranceLoopProps extends HTMLAttributes<HTMLDivElement> {
  kind: ReassuranceKind;
  userName?: string;
  onPrimaryAction: () => void;
  onSecondaryAction?: () => void;
  onEscapeHatch?: () => void;
  providerName?: string;
}

const content: Record<ReassuranceKind, {
  illustration: string;
  message: string | ((name?: string) => string);
  primaryLabel: string;
  secondaryLabel?: string;
  escapeLabel?: string;
}> = {
  "post-submission": {
    illustration: "🙏",
    message: (name) =>
      `Thank you for sharing how you're feeling, ${name || "Maya"}. That takes strength.`,
    primaryLabel: "Back to dashboard",
  },
  "next-day-followup": {
    illustration: "☀️",
    message: (name) =>
      `Hi ${name || "Maya"} — checking in after yesterday. How are you feeling today?`,
    primaryLabel: "I'm feeling better",
    secondaryLabel: "About the same",
    escapeLabel: "Worse than yesterday",
  },
  milestone: {
    illustration: "🌸",
    message: "Hey, we just wanted to say — you've been doing great this week.",
    primaryLabel: "Thanks! 💕",
  },
  "positive-checkin": {
    illustration: "✓",
    message: "You're doing well. Keep listening to what your body needs.",
    primaryLabel: "Back to dashboard",
  },
  "provider-followup": {
    illustration: "📋",
    message: (name) =>
      `Hi ${name || "Maya"} — has ${"Dr. Johnson"} reached out yet?`,
    primaryLabel: "Yes, they reached out",
    secondaryLabel: "Not yet",
    escapeLabel: "Remind me later",
  },
};

export function ReassuranceLoop({
  kind,
  userName,
  onPrimaryAction,
  onSecondaryAction,
  onEscapeHatch,
  providerName,
  className,
  ...props
}: ReassuranceLoopProps) {
  const config = content[kind];
  const resolvedMessage = typeof config.message === "function"
    ? config.message(userName)
    : config.message;

  const resolvedSecondaryLabel = kind === "provider-followup"
    ? config.secondaryLabel
    : config.secondaryLabel;

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center px-6 py-12 text-center",
        className,
      )}
      role="status"
      aria-live="polite"
      {...props}
    >
      <span className="text-5xl mb-4" aria-hidden="true">
        {config.illustration}
      </span>

      <p className="text-lg font-medium text-esc-slate-800 max-w-sm mb-8 leading-7">
        {resolvedMessage}
      </p>

      <div className="w-full max-w-xs space-y-3">
        <button
          type="button"
          onClick={onPrimaryAction}
          className={cn(
            "w-full py-4 px-6 rounded-lg text-base font-semibold",
            "bg-esc-indigo-500 text-white",
            "hover:bg-esc-indigo-600 active:scale-[0.97]",
            "focus:outline-none focus:ring-2 focus:ring-esc-indigo-400 focus:ring-offset-2",
            "transition-all duration-150 touch-target",
          )}
        >
          {config.primaryLabel}
        </button>

        {config.secondaryLabel && onSecondaryAction && (
          <button
            type="button"
            onClick={onSecondaryAction}
            className={cn(
              "w-full py-3 px-6 rounded-lg text-base font-medium",
              "text-esc-slate-600 bg-esc-slate-50 border border-esc-slate-100",
              "hover:bg-esc-slate-100 hover:text-esc-slate-800",
              "focus:outline-none focus:ring-2 focus:ring-esc-slate-400 focus:ring-offset-2",
              "transition-all duration-150 touch-target",
            )}
          >
            {config.secondaryLabel}
          </button>
        )}

        {config.escapeLabel && onEscapeHatch && (
          <button
            type="button"
            onClick={onEscapeHatch}
            className={cn(
              "w-full py-3 text-sm underline underline-offset-2",
              "text-esc-slate-500 hover:text-esc-slate-700",
              "focus:outline-none focus:ring-2 focus:ring-esc-slate-400 focus:ring-offset-2 rounded",
              "transition-colors duration-150 touch-target",
            )}
          >
            {config.escapeLabel}
          </button>
        )}
      </div>
    </div>
  );
}
