import { useState, type InputHTMLAttributes, type Ref } from "react";

type PasswordInputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
  ref?: Ref<HTMLInputElement>;
};

const PasswordInput = ({ label, error, className = "", id, disabled, ref, ...props }: PasswordInputProps) => {
  const [visible, setVisible] = useState(false);
  const inputId = id || props.name;
  const errorId = inputId ? `${inputId}-error` : undefined;

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-ink">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          id={inputId}
          ref={ref}
          type={visible ? "text" : "password"}
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          className={`h-12 w-full rounded-lg border bg-surface px-4 pr-16 text-base text-ink placeholder:text-muted outline-none transition focus:ring-2 disabled:opacity-60 ${error ? "border-danger focus:border-danger focus:ring-danger/20" : "border-border focus:border-brand focus:ring-brand/20"} ${className}`}
          {...props}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          disabled={disabled}
          aria-label={visible ? "Скрыть пароль" : "Показать пароль"}
          aria-pressed={visible}
          className="absolute inset-y-0 right-3 text-sm text-muted disabled:opacity-50 active:scale-95"
        >
          {visible ? "Скрыть" : "Показать"}
        </button>
      </div>
      {error && (
        <p id={errorId} className="text-sm text-danger">
          {error}
        </p>
      )}
    </div>
  );
};

export default PasswordInput;
