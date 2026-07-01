import React from "react";

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children: React.ReactNode;
}

export function Label({ children, className = "", ...props }: LabelProps) {
  /* ponytail: label styles matching custom design variables */
  return (
    <label className={`block text-xs font-bold uppercase text-text-h tracking-wider mb-2 ${className}`} {...props}>
      {children}
    </label>
  );
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = "", ...props }, ref) => {
    const inputId = props.id || props.name;
    const errorId = inputId ? `${inputId}-error` : undefined;
    return (
      <div className="space-y-1 w-full">
        {label && <Label htmlFor={inputId}>{label}</Label>}
        <input
          ref={ref}
          id={inputId}
          aria-describedby={error ? errorId : undefined}
          aria-invalid={!!error}
          className={`w-full rounded-xl border border-input-border bg-input-bg px-4 py-3.5 text-lg text-input-text placeholder-input-placeholder focus:border-input-focus focus:ring-2 focus:ring-link/25 focus:outline-none transition-colors ${className}`}
          suppressHydrationWarning
          {...props}
        />
        {error && <p id={errorId} role="alert" className="text-[10px] text-rose-500 mt-1">{error}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className = "", ...props }, ref) => {
    const inputId = props.id || props.name;
    const errorId = inputId ? `${inputId}-error` : undefined;
    return (
      <div className="space-y-1 w-full">
        {label && <Label htmlFor={inputId}>{label}</Label>}
        <textarea
          ref={ref}
          id={inputId}
          aria-describedby={error ? errorId : undefined}
          aria-invalid={!!error}
          className={`w-full rounded-xl border border-input-border bg-input-bg px-4 py-3.5 text-lg text-input-text placeholder-input-placeholder focus:border-input-focus focus:ring-2 focus:ring-link/25 focus:outline-none transition-colors min-h-[100px] ${className}`}
          suppressHydrationWarning
          {...props}
        />
        {error && <p id={errorId} role="alert" className="text-[10px] text-rose-500 mt-1">{error}</p>}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  children: React.ReactNode;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, children, className = "", ...props }, ref) => {
    const inputId = props.id || props.name;
    const errorId = inputId ? `${inputId}-error` : undefined;
    return (
      <div className="space-y-1 w-full">
        {label && <Label htmlFor={inputId}>{label}</Label>}
        <select
          ref={ref}
          id={inputId}
          aria-describedby={error ? errorId : undefined}
          aria-invalid={!!error}
          className={`w-full rounded-xl border border-input-border bg-input-bg px-4 py-3.5 text-lg text-input-text placeholder-input-placeholder focus:border-input-focus focus:ring-2 focus:ring-link/25 focus:outline-none transition-colors cursor-pointer ${className}`}
          suppressHydrationWarning
          {...props}
        >
          {children}
        </select>
        {error && <p id={errorId} role="alert" className="text-[10px] text-rose-500 mt-1">{error}</p>}
      </div>
    );
  }
);
Select.displayName = "Select";

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, error, className = "", ...props }, ref) => {
    const inputId = props.id || props.name;
    const errorId = inputId ? `${inputId}-error` : undefined;
    return (
      <div className="space-y-1">
        <label className="flex items-center gap-2 cursor-pointer text-xs text-text-body">
          <input
            type="checkbox"
            ref={ref}
            id={inputId}
            aria-describedby={error ? errorId : undefined}
            aria-invalid={!!error}
            className={`rounded border-input-border bg-input-bg text-link focus:ring-link/25 ${className}`}
            suppressHydrationWarning
            {...props}
          />
          <span>{label}</span>
        </label>
        {error && <p id={errorId} role="alert" className="text-[10px] text-rose-500 mt-1">{error}</p>}
      </div>
    );
  }
);
Checkbox.displayName = "Checkbox";

