import { useState } from "react";
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

  const {register, handleSubmit, reset, formState: { errors }} = useForm<RegisterUserFormData>({
      resolver: zodResolver(registerUserSchema)
    });

  const { onChange: onImageChange, ...imageRegister } = register("profileImage");
     
    const onSubmit = async (data: RegisterUserFormData) => {
    try {
      setLoading(true);
      setServerError(null);
      const user = await registerUser(data);
      dispatch(setUser(user));
      toast.success("Account Created Successfully");
      reset();
      setPreview(null);
      navigate("/");
      } catch (err:any) {
        setServerError(err.message);
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    }
    
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Input
        label="Username"
        placeholder="Enter your username"
        autoComplete="username"
        disabled={loading}
        error={errors.username?.message}
        {...register("username")}
      />
      <Input
        label="Email"
        type="email"
        placeholder="Enter your email"
        autoComplete="email"
        inputMode="email"
        disabled={loading}
        error={errors.email?.message}
        {...register("email")}
      />
      <PasswordInput
        label="Password"
        placeholder="Enter your password"
        autoComplete="new-password"
        disabled={loading}
        error={errors.password?.message}
        {...register("password")}
      />
      <PasswordInput
        label="Confirm password"
        placeholder="Confirm your password"
        autoComplete="new-password"
        disabled={loading}
        error={errors.confirmPassword?.message}
        {...register("confirmPassword")}
      />
      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-brand">Profile image</span>
        <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-white/20 bg-white/5 p-3 active:scale-[0.99]">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white/10 text-sm text-neutral-300">
            {preview ? (
              <img src={preview} alt="Preview" className="h-full w-full object-cover" />
            ) : (
              "Photo"
            )}
          </div>
          <div className="text-sm text-neutral-300">
            <p className="font-medium text-white">Choose photo</p>
            <p>JPG, PNG or WebP</p>
          </div>
          <input
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            className="sr-only"
            disabled={loading}
            {...imageRegister}
            onChange={(e) => {
              const file = e.target.files?.[0];
              setPreview(file ? URL.createObjectURL(file) : null);
              void onImageChange(e);
            }}
          />
        </label>
        {errors.profileImage && (
          <p className="text-sm text-red-400">{String(errors.profileImage.message)}</p>
        )}
      </div>
      {serverError && (
        <p className="text-sm text-red-400">{serverError}</p>
      )}
      <Button type="submit" loading={loading}>
        {loading ? "Registering..." : "Register"}
      </Button>
    </form>
  )
}

export default RegisterUserForm
