import { useSelector } from "react-redux";
import type { RootState } from "../store/store";
import Spinner from "../components/ui/Spinner";
import AppShell from "../components/layout/AppShell";

const HomePage = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const { loading } = useSelector((state: RootState) => state.auth);

  if (loading) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-canvas">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <AppShell>
      <section className="mx-auto max-w-lg">
        <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
          <h1 className="text-xl font-semibold text-ink">Welcome, {user?.name}</h1>
          <p className="mt-2 text-sm text-muted">
            Consultations from advisors and client discussions will appear in this feed.
          </p>
        </div>
      </section>
    </AppShell>
  );
};

export default HomePage;
