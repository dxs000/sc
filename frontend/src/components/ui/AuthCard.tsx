import type { ReactNode } from "react";

type AuthCardProps = {
  title: string;
  children: ReactNode;
};

const AuthCard = ({ title, children }: AuthCardProps) => {
  return (
    <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 px-4 py-6 shadow-2xl shadow-[#230737] backdrop-blur sm:px-6">
      <h2 className="mb-4 text-center text-lg font-semibold text-white md:text-xl">{title}</h2>
      {children}
    </div>
  );
};

export default AuthCard;
