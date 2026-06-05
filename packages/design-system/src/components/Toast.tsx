import { useEffect, useState } from "react";
import { cn } from "../utils/cn";

interface ToastProps {
  message: string;
  type?: "success" | "info" | "warning";
  duration?: number;
  onDismiss?: () => void;
}

export function Toast({
  message,
  type = "info",
  duration = 4000,
  onDismiss,
}: ToastProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onDismiss?.();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onDismiss]);

  if (!visible) return null;

  return (
    <div
      className={cn(
        "fixed top-4 left-4 right-4 z-50 p-4 rounded-md shadow-elevated text-white text-base font-medium",
        "animate-slide-down transition-opacity",
        type === "success" && "bg-sage-500",
        type === "info" && "bg-info",
        type === "warning" && "bg-warning text-warm-900",
      )}
    >
      {message}
    </div>
  );
}
