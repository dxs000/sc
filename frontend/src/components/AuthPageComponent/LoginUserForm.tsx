import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { loginUserSchema } from "../../schemas/auth.schema"
import { useState } from "react"
import type { LoginUserFormData } from "../../schemas/auth.schema"
import { loginUser } from "../../services/auth.service"
import { toast } from "../ui/Toast"
import Spinner from "../ui/Spinner"

const LoginUserForm = () => {
  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const {register, handleSubmit, reset, formState: { errors }} = useForm<LoginUserFormData>({
    resolver: zodResolver(loginUserSchema)
  });

  const onSubmit = async (data: LoginUserFormData) => {
    try {
      setLoading(true);
      setServerError(null);
      await loginUser(data);
      toast.success("Logged in successfully");
      reset();
    } catch (error: any) {
      const message = error?.message || "Login failed";
      setServerError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="border my-10">
      <div className="flex flex-col md:gap-2 mx-6 mb-4">
        <label className="text-[#9929EA]">Username</label>
        <input type="text" {...register("identifier")} className="text-white border border-white md:p-2 rounded-xl" placeholder="Enter your username" disabled={loading} />
        {errors.identifier && (
            <p className="text-red-400">{errors.identifier.message}</p>
        )}
      </div>
      <div className="flex flex-col md:gap-2 mx-6 mb-4">
        <label className="text-[#9929EA]">Password</label>
        <input type="password" {...register("password")} className="text-white border border-white md:p-2 rounded-xl" placeholder="Enter your password" disabled={loading} />
         {errors.password && (
            <p className="text-red-400">{errors.password.message}</p>
        )}
      </div>
      {serverError && (
        <p className="text-red-400 text-sm mx-6 mb-2">{serverError}</p>
      )}
      <div className="flex flex-col md:gap-2 mx-6 mb-4">
        <button
          type="submit"
          disabled={loading}
          className="bg-[#9929EA] text-white font-bold md:py-2 rounded-xl hover:cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading && <Spinner size="sm" />}
          {loading ? "Logging in..." : "Login"}
        </button>
      </div>
    </form>
  )
}

export default LoginUserForm
