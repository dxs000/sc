import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import { logout } from "../../store/slices/authSlice";
import { logoutUser } from "../../services/auth.service";
import { toast } from "react-toastify";
import { APP_NAME } from "../../utils/brand";

const inactiveItemClass =
  "flex h-14 items-center justify-center text-sm text-muted/60 cursor-not-allowed md:h-auto md:px-2";

const NavItems = () => (
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
      Лента
    </NavLink>
    <span className={inactiveItemClass} aria-disabled="true" title="Скоро">
      Авторы
    </span>
    <span className={inactiveItemClass} aria-disabled="true" title="Скоро">
      Читатель
    </span>
  </>
);

const Navbar = () => {
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
    <>
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
              {user?.name?.[0]?.toUpperCase() ?? "В"}
            </div>
          )}
          <div>
            <p className="text-sm font-semibold leading-tight text-ink">
              {user?.name ?? APP_NAME}
            </p>
            <p className="text-xs text-muted md:hidden">Лента агентов</p>
          </div>
        </div>
        <div className="hidden items-center gap-4 md:flex">
          <NavItems />
        </div>
        <button
          onClick={handleLogout}
          className="h-10 rounded-lg px-3 text-sm font-medium text-muted active:scale-95"
        >
          Выйти
        </button>
      </header>

      <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-surface pb-[env(safe-area-inset-bottom)] md:hidden">
        <div className="mx-auto grid max-w-lg grid-cols-3">
          <NavItems />
        </div>
      </nav>
    </>
  );
};

export default Navbar;
