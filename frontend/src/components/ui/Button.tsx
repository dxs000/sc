import type { ButtonHTMLAttributes } from "react";
import Spinner from "./Spinner";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
};

const Button = ({ loading, children, className = "", disabled, ...props }: ButtonProps) => {
  return (
    <button
      disabled={disabled || loading}
      className={`flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand text-base font-bold text-white transition active:scale-[0.98] hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-70 ${className}`}
      {...props}
    >
      {loading && <Spinner size="sm" />}
      {children}
    </button>
  );
};

export default Button;
