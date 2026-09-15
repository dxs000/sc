import { useSelector } from "react-redux";
import type { RootState } from "../store/store";
import Spinner from "../components/ui/Spinner";
import AppShell from "../components/layout/AppShell";

const HomePage = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const { loading } = useSelector((state: RootState) => state.auth);

  if (loading) {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <AppShell>
      <section className="mx-auto max-w-lg">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <h1 className="text-xl font-semibold">Welcome, {user?.name}</h1>
          <p className="mt-2 text-sm text-neutral-400">
            Your feed will appear here. Pull to refresh and new posts are coming next.
          </p>
        </div>
      </section>
    </AppShell>
  );
};

export default HomePage;
