import { forwardRef, type InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
};

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = "", id, ...props }, ref) => {
    const inputId = id || props.name;

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-brand">
            {label}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          className={`h-12 w-full rounded-xl border border-white/20 bg-white/5 px-4 text-base text-white placeholder:text-neutral-400 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/50 disabled:opacity-60 ${className}`}
          {...props}
        />
        {error && <p className="text-sm text-red-400">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
