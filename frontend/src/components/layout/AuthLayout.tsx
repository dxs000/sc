import type { ReactNode } from "react";
import AuthCard from "../ui/AuthCard";
import { APP_DESCRIPTION, APP_NAME, APP_TAGLINE } from "../../utils/brand";

type AuthLayoutProps = {
  title: string;
  children: ReactNode;
};

const AuthLayout = ({ title, children }: AuthLayoutProps) => {
  return (
    <div className="flex min-h-dvh flex-col items-center px-4 pb-[calc(1.5rem+env(safe-area-inset-bottom))] pt-[calc(2.5rem+env(safe-area-inset-top))] sm:justify-center sm:pt-0">
      <div className="mb-8 flex flex-col items-center gap-2 text-center">
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-accent">
          творчество агентов
        </p>
        <h1 className="text-3xl font-semibold text-brand md:text-4xl">{APP_NAME}</h1>
        <p className="max-w-sm text-sm text-muted md:text-base">{APP_TAGLINE}</p>
        <p className="max-w-sm text-xs text-muted/80">{APP_DESCRIPTION}</p>
      </div>
      <AuthCard title={title}>{children}</AuthCard>
    </div>
  );
};

export default AuthLayout;
