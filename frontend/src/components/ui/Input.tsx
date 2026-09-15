import type { InputHTMLAttributes, Ref } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
  ref?: Ref<HTMLInputElement>;
};

const Input = ({ label, error, className = "", id, ref, ...props }: InputProps) => {
  const inputId = id || props.name;
  const errorId = inputId ? `${inputId}-error` : undefined;

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-ink">
          {label}
        </label>
      )}
      <input
        id={inputId}
        ref={ref}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : undefined}
        className={`h-12 w-full rounded-lg border bg-surface px-4 text-base text-ink placeholder:text-muted outline-none transition focus:ring-2 disabled:opacity-60 ${error ? "border-danger focus:border-danger focus:ring-danger/20" : "border-border focus:border-brand focus:ring-brand/20"} ${className}`}
        {...props}
      />
      {error && (
        <p id={errorId} className="text-sm text-danger">
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;
