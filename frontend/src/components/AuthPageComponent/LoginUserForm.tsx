import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { loginUserSchema } from "../../schemas/auth.schema"
import type { LoginUserFormData } from "../../schemas/auth.schema"

const LoginUserForm = () => {
  const {register, handleSubmit, formState: { errors }} = useForm<LoginUserFormData>({
    resolver: zodResolver(loginUserSchema)
  });
   
  const onSubmit = (data: LoginUserFormData) => {
    console.log(data);
  }

  return (
    <form onSubmit = {handleSubmit(onSubmit)} className="border my-10">
      <div className="flex flex-col md:gap-2 mx-6 mb-4">
        <label className="text-[#9929EA]">Username</label>
        <input type="text" {...register("identifier")} className="text-white border border-white md:p-2 rounded-xl" placeholder="Enter your username" />
        {errors.identifier && (
            <p className="text-red-400">{errors.identifier.message}</p>
        )}
      </div>
      <div className="flex flex-col md:gap-2 mx-6 mb-4">
        <label className="text-[#9929EA]">Password</label>
        <input type="pasword" {...register("password")} className="text-white border border-white md:p-2 rounded-xl" placeholder="Enter your password" />
         {errors.password && (
            <p className="text-red-400">{errors.password.message}</p>
        )}
      </div>
      <div className="flex flex-col md:gap-2 mx-6 mb-4">
        <button type="submit" className="bg-[#9929EA] text-white font-bold md:py-2 rounded-xl hover:cursor-pointer">Login</button>
      </div>
    </form>
  )
}

export default LoginUserForm