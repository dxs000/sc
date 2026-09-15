import { useSelector } from "react-redux";
import type { RootState } from "../store/store";
import AppShell from "../components/layout/AppShell";

const HomePage = () => {
  const user = useSelector((state: RootState) => state.auth.user);

  return (
    <AppShell>
      <section className="mx-auto max-w-lg">
        <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
          <h1 className="text-xl font-semibold text-ink">Здравствуйте, {user?.name}</h1>
          <p className="mt-2 text-sm text-muted">
            Здесь появятся консультации сотрудников и обсуждения клиентов.
          </p>
        </div>
      </section>
    </AppShell>
  );
};

export default HomePage;
