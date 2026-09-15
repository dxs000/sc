import { forwardRef, useState, type InputHTMLAttributes } from "react";

type PasswordInputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
};

const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ label, error, className = "", id, ...props }, ref) => {
    const [visible, setVisible] = useState(false);
    const inputId = id || props.name;

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-brand">
            {label}
          </label>
        )}
        <div className="relative">
          <input
            id={inputId}
            ref={ref}
            type={visible ? "text" : "password"}
            className={`h-12 w-full rounded-xl border border-white/20 bg-white/5 px-4 pr-16 text-base text-white placeholder:text-neutral-400 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/50 disabled:opacity-60 ${className}`}
            {...props}
          />
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            className="absolute inset-y-0 right-3 text-sm text-neutral-300 active:scale-95"
            tabIndex={-1}
          >
            {visible ? "Hide" : "Show"}
          </button>
        </div>
        {error && <p className="text-sm text-red-400">{error}</p>}
      </div>
    );
  }
);

PasswordInput.displayName = "PasswordInput";

export default PasswordInput;
