import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
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
  (
    { className, variant, size, asChild = false, children, loading, ...props },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={loading || props.disabled}
        {...props}
      >
        {loading ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 24 24"
            data-testid="loader"
            className="h-auto w-[22px] text-current scale-95"
          >
            <g>
              <path d="M11 1h2v5h-2z" opacity="0.14"></path>
              <path
                d="m16.634 1.974 1.732 1-2.5 4.33-1.732-1z"
                opacity="0.29"
              ></path>
              <path
                d="m21.026 5.634 1 1.732-4.33 2.5-1-1.732z"
                opacity="0.43"
              ></path>
              <path d="M23 11v2h-5v-2z" opacity="0.57"></path>
              <path
                d="m22.026 16.634-1 1.732-4.33-2.5 1-1.732z"
                opacity="0.71"
              ></path>
              <path
                d="m18.366 21.026-1.732 1-2.5-4.33 1.732-1z"
                opacity="0.86"
              ></path>
              <path d="M13 23h-2v-5h2z"></path>
              <animateTransform
                attributeName="transform"
                calcMode="discrete"
                dur="0.75s"
                repeatCount="indefinite"
                type="rotate"
                values="0 12 12;30 12 12;60 12 12;90 12 12;120 12 12;150 12 12;180 12 12;210 12 12;240 12 12;270 12 12;300 12 12;330 12 12;360 12 12"
              ></animateTransform>
            </g>
          </svg>
        ) : (
          children
        )}
      </Comp>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
