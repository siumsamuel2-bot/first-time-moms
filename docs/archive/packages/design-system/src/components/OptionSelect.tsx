import { cn } from "../utils/cn";

interface Option<T extends string> {
  value: T;
  label: string;
  description?: string;
  icon?: React.ReactNode;
}

interface OptionSelectProps<T extends string> {
  options: Option<T>[];
  value: T | null;
  onChange: (value: T) => void;
  className?: string;
  layout?: "vertical" | "grid";
}

export function OptionSelect<T extends string>({
  options,
  value,
  onChange,
  className,
  layout = "vertical",
}: OptionSelectProps<T>) {
  return (
    <div
      className={cn(
        "gap-3",
        layout === "grid" ? "grid grid-cols-2" : "flex flex-col",
        className,
      )}
    >
      {options.map((opt) => {
        const selected = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={cn(
              "flex items-start gap-3 p-4 rounded-md border-2 text-left transition-all duration-150 touch-target",
              selected
                ? "border-rose-400 bg-rose-50"
                : "border-warm-200 bg-white hover:border-warm-300",
            )}
          >
            {opt.icon && (
              <span className={cn("mt-0.5", selected ? "text-rose-500" : "text-warm-500")}>
                {opt.icon}
              </span>
            )}
            <div className="flex-1 min-w-0">
              <div
                className={cn(
                  "font-medium",
                  selected ? "text-rose-700" : "text-warm-900",
                )}
              >
                {opt.label}
              </div>
              {opt.description && (
                <div className="text-sm text-warm-500 mt-0.5">{opt.description}</div>
              )}
            </div>
            <div
              className={cn(
                "w-5 h-5 rounded-full border-2 flex-shrink-0 mt-0.5 flex items-center justify-center transition-all",
                selected ? "border-rose-500" : "border-warm-300",
              )}
            >
              {selected && <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />}
            </div>
          </button>
        );
      })}
    </div>
  );
}
