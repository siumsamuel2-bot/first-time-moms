import { type HTMLAttributes } from "react";
import { cn } from "../utils/cn";

export interface CrisisEntryPointProps extends HTMLAttributes<HTMLDivElement> {
  userName?: string;
  isSelfHarmFlag?: boolean;
  onDismiss: () => void;
  clinicianNotified?: boolean;
}

export function CrisisEntryPoint({
  userName,
  isSelfHarmFlag = false,
  onDismiss,
  clinicianNotified = true,
  className,
  ...props
}: CrisisEntryPointProps) {
  const headline = isSelfHarmFlag ? "You matter." : "Immediate support resources";
  const subhead = isSelfHarmFlag
    ? "Help is available right now. Please reach out."
    : "These resources are available 24/7 if you need someone to talk to.";

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center min-h-[500px] px-6 py-12 bg-esc-crisis-50",
        className,
      )}
      role="alertdialog"
      aria-describedby="crisis-headline crisis-subhead"
      {...props}
    >
      <div className="mb-6" aria-hidden="true">
        <svg
          className="w-16 h-16"
          viewBox="0 0 64 64"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M32 8C18.745 8 8 18.745 8 32s10.745 24 24 24 24-10.745 24-24S45.255 8 32 8z"
            fill="#FFF1F2"
          />
          <path
            d="M32 16c-4.418 0-8 3.582-8 8 0 4.418 8 16 8 16s8-11.582 8-16c0-4.418-3.582-8-8-8z"
            fill="#BE123C"
          />
          <path
            d="M32 40a2 2 0 100 4 2 2 0 000-4z"
            fill="#BE123C"
          />
          <rect x="30" y="28" width="4" height="8" rx="1" fill="#BE123C" />
        </svg>
      </div>

      <h2
        id="crisis-headline"
        className="text-3xl font-bold text-esc-slate-800 text-center mb-3"
      >
        {headline}
      </h2>

      <p
        id="crisis-subhead"
        className="text-lg text-esc-slate-600 text-center mb-8 max-w-sm"
      >
        {subhead}
      </p>

      <div className="w-full max-w-sm space-y-3 mb-6">
        <a
          href="tel:988"
          className={cn(
            "flex items-center justify-center gap-3 w-full py-4 px-6 rounded-full text-base font-semibold",
            "bg-white text-esc-crisis-600 border border-esc-crisis-100",
            "hover:bg-esc-crisis-100 hover:border-esc-crisis-600",
            "focus:outline-none focus:ring-2 focus:ring-esc-crisis-600 focus:ring-offset-2",
            "transition-all duration-150 touch-target",
          )}
        >
          <span aria-hidden="true">📞</span>
          Call 988
          <span className="sr-only">Call 988 Suicide and Crisis Lifeline</span>
        </a>

        <a
          href="sms:741741?body=HOME"
          className={cn(
            "flex items-center justify-center gap-3 w-full py-4 px-6 rounded-full text-base font-semibold",
            "bg-white text-esc-crisis-600 border border-esc-crisis-100",
            "hover:bg-esc-crisis-100 hover:border-esc-crisis-600",
            "focus:outline-none focus:ring-2 focus:ring-esc-crisis-600 focus:ring-offset-2",
            "transition-all duration-150 touch-target",
          )}
        >
          <span aria-hidden="true">📱</span>
          Text HOME to 741741
          <span className="sr-only">Text HOME to 741741 Crisis Text Line</span>
        </a>
      </div>

      {clinicianNotified && isSelfHarmFlag && (
        <p className="text-sm text-esc-slate-200 text-center mb-6">
          A clinician has been notified and will reach out within 30 minutes.
        </p>
      )}

      {!isSelfHarmFlag && (
        <p className="text-sm text-esc-slate-200 text-center mb-6">
          No one has been notified. These resources are here for you anytime.
        </p>
      )}

      <button
        type="button"
        onClick={onDismiss}
        className={cn(
          "text-base text-esc-slate-500 hover:text-esc-slate-700 underline underline-offset-2",
          "focus:outline-none focus:ring-2 focus:ring-esc-slate-400 focus:ring-offset-2 rounded",
          "transition-colors duration-150 touch-target",
        )}
      >
        I understand, return to dashboard
      </button>
    </div>
  );
}
