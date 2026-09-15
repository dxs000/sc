import type { ReactNode } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import { logout } from "../../store/slices/authSlice";
import { logoutUser } from "../../services/auth.service";
import { toast } from "react-toastify";

type AppShellProps = {
  children: ReactNode;
};

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

  return (
    <div className="flex min-h-dvh flex-col bg-neutral-950">
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-white/10 bg-neutral-950/90 px-4 py-3 backdrop-blur pt-[calc(0.75rem+env(safe-area-inset-top))]">
        <div className="flex items-center gap-3">
          {user?.profileImage ? (
            <img
              src={user.profileImage}
              alt={user.name}
              className="h-9 w-9 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand text-sm font-bold">
              {user?.name?.[0]?.toUpperCase() ?? "C"}
            </div>
          )}
          <div>
            <p className="text-sm font-semibold leading-tight">{user?.name ?? "ConnectHub"}</p>
            <p className="text-xs text-neutral-400">Home</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="h-10 rounded-lg px-3 text-sm font-medium text-red-400 active:scale-95"
        >
          Logout
        </button>
      </header>

      <main className="flex-1 px-4 py-4 pb-[calc(5rem+env(safe-area-inset-bottom))]">
        {children}
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-white/10 bg-neutral-950/95 backdrop-blur pb-[env(safe-area-inset-bottom)]">
        <div className="mx-auto grid max-w-lg grid-cols-3">
          <span className="flex h-14 items-center justify-center text-sm font-medium text-brand">Feed</span>
          <span className="flex h-14 items-center justify-center text-sm text-neutral-400">Create</span>
          <span className="flex h-14 items-center justify-center text-sm text-neutral-400">Profile</span>
        </div>
      </nav>
    </div>
  );
};

export default AppShell;
