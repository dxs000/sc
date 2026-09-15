import type { ReactNode } from "react";

type AuthCardProps = {
  title: string;
  children: ReactNode;
};

const AuthCard = ({ title, children }: AuthCardProps) => {
  return (
    <div className="w-full max-w-md rounded-2xl border border-border bg-surface px-4 py-6 shadow-sm sm:px-6">
      <h2 className="mb-4 text-center text-lg font-semibold text-ink md:text-xl">{title}</h2>
      {children}
    </div>
  );
};

export default AuthCard;
