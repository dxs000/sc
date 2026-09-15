import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { loginUserSchema } from "../../schemas/auth.schema"
import { useState } from "react"
import type { LoginUserFormData } from "../../schemas/auth.schema"
import { loginUser } from "../../services/auth.service"
import { toast } from "react-toastify"
import { useDispatch} from "react-redux";
import { setUser } from "../../store/slices/authSlice";
import { useNavigate } from "react-router-dom"
import Input from "../ui/Input"
import PasswordInput from "../ui/PasswordInput"
import Button from "../ui/Button"

const LoginUserForm = () => {
  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const dispatch = useDispatch();
  const navigate = useNavigate()

  const {register, handleSubmit, reset, formState: { errors }} = useForm<LoginUserFormData>({
    resolver: zodResolver(loginUserSchema)
  });

  const onSubmit = async (data: LoginUserFormData) => {
    try {
      setLoading(true);
      setServerError(null);
      const user = await loginUser(data);
      dispatch(setUser(user));
      toast.success("Logged in successfully");
      reset();
      navigate("/");
    } catch (error: any) {
      const message = error?.message || "Login failed";
      setServerError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Input
        label="Username or email"
        placeholder="Enter your username"
        autoComplete="username"
        disabled={loading}
        error={errors.identifier?.message}
        {...register("identifier")}
      />
      <PasswordInput
        label="Password"
        placeholder="Enter your password"
        autoComplete="current-password"
        disabled={loading}
        error={errors.password?.message}
        {...register("password")}
      />
      {serverError && (
        <p className="text-sm text-red-400">{serverError}</p>
      )}
      <Button type="submit" loading={loading}>
        {loading ? "Logging in..." : "Login"}
      </Button>
    </form>
  )
}

export default LoginUserForm
