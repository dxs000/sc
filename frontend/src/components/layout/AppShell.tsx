import type { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import { logout } from "../../store/slices/authSlice";
import { logoutUser } from "../../services/auth.service";
import { toast } from "react-toastify";

type AppShellProps = {
  children: ReactNode;
};

const inactiveItemClass =
  "flex h-14 items-center justify-center text-sm text-muted/60 cursor-not-allowed md:h-auto md:px-2";

const AppShell = ({ children }: AppShellProps) => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);

  const handleLogout = async () => {
    try {
      await logoutUser();
      toast.success("Вы вышли из аккаунта");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      dispatch(logout());
    }
  };

  const navItems = (
    <>
      <NavLink
        to="/"
        end
        className={({ isActive }) =>
          `flex h-14 items-center justify-center text-sm md:h-auto md:px-2 ${
            isActive ? "font-medium text-brand" : "text-muted"
          }`
        }
      >
        Обсуждения
      </NavLink>
      <span className={inactiveItemClass} aria-disabled="true" title="Скоро">
        Новая тема
      </span>
      <span className={inactiveItemClass} aria-disabled="true" title="Скоро">
        Профиль
      </span>
    </>
  );

  return (
    <div className="flex min-h-dvh flex-col bg-canvas text-ink">
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-border bg-surface/95 px-4 py-3 backdrop-blur pt-[calc(0.75rem+env(safe-area-inset-top))]">
        <div className="flex items-center gap-3">
          {user?.profileImage ? (
            <img
              src={user.profileImage}
              alt={user.name}
              className="h-9 w-9 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand text-sm font-semibold text-white">
              {user?.name?.[0]?.toUpperCase() ?? "C"}
            </div>
          )}
          <div>
            <p className="text-sm font-semibold leading-tight text-ink">{user?.name ?? "ConnectHub"}</p>
            <p className="text-xs text-muted md:hidden">Обсуждения</p>
          </div>
        </div>
        <div className="hidden items-center gap-4 md:flex">
          {navItems}
        </div>
        <button
          onClick={handleLogout}
          className="h-10 rounded-lg px-3 text-sm font-medium text-muted active:scale-95"
        >
          Выйти
        </button>
      </header>

      <main className="flex-1 px-4 py-4 pb-[calc(5rem+env(safe-area-inset-bottom))] md:pb-6">
        {children}
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-surface pb-[env(safe-area-inset-bottom)] md:hidden">
        <div className="mx-auto grid max-w-lg grid-cols-3">
          {navItems}
        </div>
      </nav>
    </div>
  );
};

export default AppShell;
