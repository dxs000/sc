import { useEffect, useState } from "react";

type ToastType = "success" | "error" | "info";

type ToastItem = {
  id: number;
  message: string;
  type: ToastType;
};

type ToastEvent = CustomEvent<{ message: string; type: ToastType }>;

const TOAST_EVENT = "app:toast";

export const toast = {
  success: (message: string) => dispatchToast(message, "success"),
  error: (message: string) => dispatchToast(message, "error"),
  info: (message: string) => dispatchToast(message, "info"),
};

function dispatchToast(message: string, type: ToastType) {
  window.dispatchEvent(
    new CustomEvent(TOAST_EVENT, { detail: { message, type } })
  );
}

const typeStyles: Record<ToastType, string> = {
  success: "border-[#9929EA] bg-[#1a0b24] text-white",
  error: "border-red-500 bg-[#2a0f14] text-red-100",
  info: "border-white/40 bg-[#131313] text-white",
};

export const Toaster = () => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    const handler = (event: Event) => {
      const { message, type } = (event as ToastEvent).detail;
      const id = Date.now() + Math.random();
      setToasts((prev) => [...prev, { id, message, type }]);
      window.setTimeout(() => {
        setToasts((prev) => prev.filter((item) => item.id !== id));
      }, 3500);
    };

    window.addEventListener(TOAST_EVENT, handler);
    return () => window.removeEventListener(TOAST_EVENT, handler);
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-[calc(100%-2rem)]">
      {toasts.map((item) => (
        <div
          key={item.id}
          className={`rounded-xl border px-4 py-3 shadow-lg shadow-black/40 ${typeStyles[item.type]}`}
          role="status"
        >
          {item.message}
        </div>
      ))}
    </div>
  );
};
