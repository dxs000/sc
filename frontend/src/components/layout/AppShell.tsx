import type { ReactNode } from "react";
import Navbar from "./Navbar";

type AppShellProps = {
  children: ReactNode;
};

const AppShell = ({ children }: AppShellProps) => {
  return (
    <div className="flex min-h-dvh flex-col bg-canvas text-ink">
      <Navbar />

      <main className="flex-1 px-4 py-4 pb-[calc(5rem+env(safe-area-inset-bottom))] md:pb-6">
        {children}
      </main>
    </div>
  );
};

export default AppShell;
