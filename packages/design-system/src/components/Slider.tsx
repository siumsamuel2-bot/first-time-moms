import { useId } from "react";
import { cn } from "../utils/cn";

interface SliderProps {
  label: string;
  min: number;
  max: number;
  value: number;
  onChange: (value: number) => void;
  minLabel?: string;
  maxLabel?: string;
  showValue?: boolean;
  className?: string;
}

export function Slider({
  label,
  min,
  max,
  value,
  onChange,
  minLabel,
  maxLabel,
  showValue = true,
  className,
}: SliderProps) {
  const id = useId();

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex justify-between items-center">
        <label htmlFor={id} className="text-base font-medium text-warm-900">
          {label}
        </label>
        {showValue && (
          <span className="text-lg font-semibold text-rose-500 tabular-nums">{value}</span>
        )}
      </div>
      <div className="relative">
        <input
          id={id}
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-2 bg-warm-200 rounded-full appearance-none cursor-pointer accent-rose-400
            [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6
            [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-rose-500
            [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer
            [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:duration-100
            [&::-webkit-slider-thumb]:active:scale-110"
        />
      </div>
      {(minLabel || maxLabel) && (
        <div className="flex justify-between text-sm text-warm-500">
          <span>{minLabel}</span>
          <span>{maxLabel}</span>
        </div>
      )}
    </div>
  );
}
