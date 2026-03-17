import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  rightElement?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, hint, leftIcon, rightIcon, rightElement, id, ...props }, ref) => {
    const inputId = id || React.useId();
    
    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-body-sm font-medium text-text-secondary mb-2"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">
              {leftIcon}
            </div>
          )}
          <input
            type={type}
            id={inputId}
            className={cn(
              "w-full h-10 px-4 rounded-lg",
              "border border-border-primary",
              "text-text-primary placeholder:text-text-muted",
              "transition-all duration-200",
              "hover:border-border-secondary",
              "focus:border-accent-primary focus:outline-none focus:ring-1 focus:ring-accent-primary/50",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              leftIcon && "pl-10",
              (rightIcon || rightElement) && "pr-10",
              error && "border-error focus:border-error focus:ring-error/50",
              className
            )}
            ref={ref}
            style={{ background: "var(--color-bg-card)" }}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted">
              {rightIcon}
            </div>
          )}
          {rightElement && (
            <div className="absolute right-2 top-1/2 -translate-y-1/2">
              {rightElement}
            </div>
          )}
        </div>
        {hint && !error && (
          <p className="mt-1.5 text-body-xs text-text-muted">{hint}</p>
        )}
        {error && (
          <p className="mt-1.5 text-body-xs text-error">{error}</p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
