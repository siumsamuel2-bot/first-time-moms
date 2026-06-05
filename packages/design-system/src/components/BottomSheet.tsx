import { useEffect, useRef } from "react";
import { cn } from "../utils/cn";

interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function BottomSheet({ open, onClose, title, children, className }: BottomSheetProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end">
      <div
        ref={overlayRef}
        className="fixed inset-0 bg-black/30 transition-opacity"
        onClick={onClose}
      />
      <div
        className={cn(
          "relative z-10 w-full bg-white rounded-t-lg shadow-modal animate-slide-up",
          "max-h-[85vh] overflow-y-auto",
          className,
        )}
      >
        <div className="flex justify-center pt-2 pb-1">
          <div className="w-10 h-1 rounded-full bg-warm-300" />
        </div>
        {title && (
          <div className="px-6 pb-2">
            <h2 className="text-xl font-semibold text-warm-900">{title}</h2>
          </div>
        )}
        <div className="px-6 pb-6">{children}</div>
      </div>
    </div>
  );
}
