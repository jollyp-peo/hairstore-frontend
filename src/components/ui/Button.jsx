import React from "react";
import { twMerge } from "tailwind-merge";
import { Link } from "react-router-dom";

// Tailwind-based utility to merge classes
const buttonBase =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&>svg]:pointer-events-none [&>svg]:size-4 [&>svg]:shrink-0";

// Variants
const variantStyles = {
  default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-md hover:shadow-luxury",
  destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
  outline: "border border-primary text-primary bg-background hover:bg-primary hover:text-primary-foreground shadow-md hover:shadow-luxury",
  secondary: "bg-secondary text-secondary-foreground hover:bg-secondary-light",
  ghost: "hover:bg-accent hover:text-accent-foreground",
  link: "text-primary underline-offset-4 hover:underline",
  luxury: "bg-gradient-luxury text-primary-foreground font-semibold shadow-luxury hover:shadow-glow hover:scale-[1.02] transform",
  hero: "bg-secondary text-secondary-foreground border-2 border-primary hover:bg-primary hover:text-primary-foreground shadow-card hover:shadow-luxury transform hover:scale-[1.02]",
  gold: "bg-primary text-primary-foreground hover:bg-primary-dark shadow-glow hover:shadow-luxury transform hover:scale-[1.02]",
};

// Sizes
const sizeStyles = {
  default: "h-11 px-6 py-2",
  sm: "h-9 rounded-md px-4 text-xs",
  lg: "h-14 rounded-xl px-10 text-base font-semibold",
  xl: "h-16 rounded-xl px-12 text-lg font-bold",
  icon: "h-10 w-10",
};

const Button = React.forwardRef(
  ({ className, variant = "default", size = "default", children, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Link : "button";
    return (
      <Comp
        ref={ref}
        className={twMerge(buttonBase, variantStyles[variant], sizeStyles[size], className)}
        {...props}
      >
        {children}
      </Comp>
    );
  }
);

Button.displayName = "Button";

export { Button };
