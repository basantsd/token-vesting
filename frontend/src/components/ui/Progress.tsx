"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
  max?: number;
  label?: string;
  showValue?: boolean;
  indicatorClassName?: string;
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value = 0, max = 100, indicatorClassName, label, showValue = false, ...props }, ref) => {
    const percentage = Math.min(100, Math.max(0, (value / max) * 100));
    
    return (
      <div className="w-full" ref={ref} {...props}>
        {(label || showValue) && (
          <div className="flex justify-between items-center mb-2">
            {label && (
              <span className="text-body-sm text-text-secondary">{label}</span>
            )}
            {showValue && (
              <span className="text-body-sm font-mono text-text-primary">
                {value.toLocaleString()} / {max.toLocaleString()}
              </span>
            )}
          </div>
        )}
        <div
          className={cn(
            "relative h-2 w-full overflow-hidden rounded-full bg-background-tertiary",
            className
          )}
        >
          <div
            className={cn(
              "h-full transition-all duration-500 ease-out rounded-full",
              indicatorClassName
            )}
            style={{ width: `${percentage}%`, background: "var(--color-emerald)" }}
          />
        </div>
        {showValue && (
          <div className="mt-1.5 flex justify-end">
            <span className="text-body-xs text-text-muted">
              {percentage.toFixed(1)}%
            </span>
          </div>
        )}
      </div>
    );
  }
);
Progress.displayName = "Progress";

export { Progress };
