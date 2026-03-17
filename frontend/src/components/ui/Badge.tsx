import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-body-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-background-tertiary text-text-secondary border border-border-primary",
        primary: "bg-accent-primary/10 text-accent-primary border border-accent-primary/20",
        success: "bg-success/10 text-success border border-success/20",
        warning: "bg-warning/10 text-warning border border-warning/20",
        error: "bg-error/10 text-error border border-error/20",
        info: "bg-info/10 text-info border border-info/20",
        outline: "bg-transparent text-text-secondary border border-border-secondary",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean;
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant, dot, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(badgeVariants({ variant }), className)}
        {...props}
      >
        {dot && (
          <span
            className={cn(
              "w-1.5 h-1.5 rounded-full",
              variant === "success" && "bg-success",
              variant === "warning" && "bg-warning",
              variant === "error" && "bg-error",
              variant === "primary" && "bg-accent-primary",
              variant === "info" && "bg-info",
              (!variant || variant === "default" || variant === "outline") && "bg-text-muted"
            )}
          />
        )}
        {children}
      </div>
    );
  }
);
Badge.displayName = "Badge";

export { Badge, badgeVariants };
