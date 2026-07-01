import React from "react";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "link" | "accent";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  as?: React.ElementType;
  href?: string;
  [key: string]: any;
}

export default function Button({
  variant = "primary",
  size = "md",
  loading = false,
  leftIcon,
  rightIcon,
  children,
  className = "",
  disabled,
  as: Component = "button",
  ...props
}: ButtonProps) {
  /* ponytail: dynamic html component support (e.g., render as anchor <a> or button) */
  const baseStyle = "inline-flex items-center justify-center font-sans font-semibold rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-link/25 disabled:opacity-50 disabled:pointer-events-none active:scale-98 cursor-pointer select-none text-center";
  
  const variants: Record<ButtonVariant, string> = {
    primary: "bg-btn-primary-bg text-btn-primary-text hover:bg-btn-primary-hover",
    secondary: "bg-btn-secondary-bg border border-btn-secondary-border text-btn-secondary-text hover:bg-btn-secondary-hover",
    outline: "bg-transparent border border-border-primary text-text-body hover:bg-bg-secondary",
    ghost: "bg-transparent text-text-body hover:bg-bg-secondary",
    link: "bg-transparent text-link hover:text-link-hover underline p-0 rounded-none inline hover:no-underline",
    accent: "bg-btn-accent-bg text-btn-accent-text hover:bg-btn-accent-hover",
  };

  const sizes: Record<ButtonSize, string> = {
    sm: "h-10 px-4 text-xs",
    md: "h-12 px-6 text-sm",
    lg: "h-14 px-8 text-base",
  };

  const formattedClassName = `${baseStyle} ${variants[variant]} ${variant === "link" ? "" : sizes[size]} ${className}`;

  return (
    <Component
      disabled={Component === "button" ? (disabled || loading) : undefined}
      className={formattedClassName}
      suppressHydrationWarning
      {...props}
    >
      {loading && (
        <svg className="animate-spin -ml-1 mr-2 h-3 w-3 text-current" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}
      {!loading && leftIcon && <span className="mr-1.5 flex items-center justify-center">{leftIcon}</span>}
      {children}
      {!loading && rightIcon && <span className="ml-1.5 flex items-center justify-center">{rightIcon}</span>}
    </Component>
  );
}
