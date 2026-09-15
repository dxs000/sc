import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod"
import { registerUserSchema } from "../../schemas/auth.schema"
import type { RegisterUserFormData } from "../../schemas/auth.schema"
import { useForm } from "react-hook-form";
import { registerUser } from "../../services/auth.service";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom"
import { useDispatch} from "react-redux";
import { setUser } from "../../store/slices/authSlice";
import Input from "../ui/Input"
import PasswordInput from "../ui/PasswordInput"
import Button from "../ui/Button"

const RegisterUserForm = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {register, handleSubmit, reset, setValue, formState: { errors }} = useForm<RegisterUserFormData>({
      resolver: zodResolver(registerUserSchema)
    });

  const { onChange: onImageChange, ...imageRegister } = register("profileImage");

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);
     
    const onSubmit = async (data: RegisterUserFormData) => {
    try {
      setLoading(true);
      setServerError(null);
      const user = await registerUser(data);
      dispatch(setUser(user));
      toast.success("Аккаунт создан");
      reset();
      setPreview((current) => {
        if (current) URL.revokeObjectURL(current);
        return null;
      });
      navigate("/");
      } catch (err:any) {
        setServerError(err.message);
      } finally {
        setLoading(false);
      }
    }

  const clearPhoto = () => {
    setPreview((current) => {
      if (current) URL.revokeObjectURL(current);
      return null;
    });
    setValue("profileImage", undefined);
  };
    
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Input
        label="Имя пользователя"
        placeholder="Введите имя пользователя"
        autoComplete="username"
        disabled={loading}
        error={errors.username?.message}
        {...register("username")}
      />
      <Input
        label="Email"
        type="email"
        placeholder="Введите email"
        autoComplete="email"
        inputMode="email"
        disabled={loading}
        error={errors.email?.message}
        {...register("email")}
      />
      <PasswordInput
        label="Пароль"
        placeholder="Введите пароль"
        autoComplete="new-password"
        disabled={loading}
        error={errors.password?.message}
        {...register("password")}
      />
      <PasswordInput
        label="Повтор пароля"
        placeholder="Повторите пароль"
        autoComplete="new-password"
        disabled={loading}
        error={errors.confirmPassword?.message}
        {...register("confirmPassword")}
      />
      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-ink">Фото профиля</span>
        <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-dashed border-border bg-canvas p-3 transition focus-within:ring-2 focus-within:ring-brand/30 active:scale-[0.99]">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-border text-sm text-muted">
            {preview ? (
              <img src={preview} alt="Превью фото" className="h-full w-full object-cover" />
            ) : (
              "Фото"
            )}
          </div>
          <div className="text-sm text-muted">
            <p className="font-medium text-ink">Выбрать фото</p>
            <p>JPG, PNG или WebP</p>
          </div>
          <input
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            className="sr-only"
            disabled={loading}
            {...imageRegister}
            onChange={(e) => {
              const file = e.target.files?.[0];
              setPreview((current) => {
                if (current) URL.revokeObjectURL(current);
                return file ? URL.createObjectURL(file) : null;
              });
              void onImageChange(e);
            }}
          />
        </label>
        {preview && (
          <button
            type="button"
            onClick={clearPhoto}
            disabled={loading}
            className="self-start text-sm text-muted underline underline-offset-2"
          >
            Удалить фото
          </button>
        )}
        {errors.profileImage && (
          <p className="text-sm text-danger">{String(errors.profileImage.message)}</p>
        )}
      </div>
      {serverError && (
        <p className="text-sm text-danger">{serverError}</p>
      )}
      <Button type="submit" loading={loading}>
        {loading ? "Регистрация..." : "Зарегистрироваться"}
      </Button>
    </form>
  )
}

export default RegisterUserForm
