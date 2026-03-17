import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background-primary disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-accent-primary text-background-primary hover:bg-accent-secondary active:bg-accent-tertiary shadow-glow-sm hover:shadow-glow-md",
        secondary:
          "bg-background-tertiary text-text-primary hover:bg-background-elevated active:bg-background-tertiary border border-border-secondary",
        outline:
          "bg-transparent text-text-primary hover:bg-background-secondary active:bg-background-tertiary border border-border-secondary hover:border-border-accent",
        ghost:
          "bg-transparent text-text-secondary hover:text-text-primary hover:bg-background-secondary",
        danger:
          "bg-error/10 text-error hover:bg-error/20 border border-error/30",
        success:
          "bg-success/10 text-success hover:bg-success/20 border border-success/30",
      },
      size: {
        sm: "h-8 px-3 text-body-sm [&>svg]:w-4 [&>svg]:h-4",
        md: "h-10 px-4 text-body-md [&>svg]:w-5 [&>svg]:h-5",
        lg: "h-12 px-6 text-body-lg [&>svg]:w-5 [&>svg]:h-5",
        xl: "h-14 px-8 text-body-xl [&>svg]:w-6 [&>svg]:h-6",
      },
      fullWidth: {
        true: "w-full",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, fullWidth, loading, disabled, children, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, fullWidth, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
