import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod"
import { registerUserSchema } from "../../schemas/auth.schema"
import type { RegisterUserFormData } from "../../schemas/auth.schema"
import { useForm } from "react-hook-form";
import { registerUser } from "../../services/auth.service";

const RegisterUserForm = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {register, handleSubmit, reset, formState: { errors, isSubmitting }} = useForm<RegisterUserFormData>({
      resolver: zodResolver(registerUserSchema)
    });
     
    const onSubmit = async (data: RegisterUserFormData) => {
      
    try {
      setLoading(true);
      setServerError(null);
      const response = await registerUser(data);
      console.log("Regsitered", response)
      reset();
      // TODO: редирект после успешной регистрации
      } catch (err:any) {
        setServerError(err.message);
      }
    }
    
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="border my-5">
      <div className="flex flex-col gap-1 md:gap-2 mx-6 mb-4">
        <label className="text-[#9929EA]">Username</label>
        <input  {...register("username")}  className="text-white border border-white md:p-2 rounded-xl" type="text" placeholder="Enter your username" />
        {errors.username && (
            <p className="text-red-400">{errors.username.message}</p>
        )}
      </div>
      <div className="flex flex-col gap-1 md:gap-2 mx-6 mb-4">
        <label className="text-[#9929EA]">Email</label>
        <input  {...register("email")}  className="text-white border border-white md:p-2 rounded-xl" type="email" placeholder="Enter your email" />
        {errors.email && (
            <p className="text-red-400">{errors.email.message}</p>
        )}
      </div>
      <div className="flex flex-col gap-1 md:gap-2 mx-6 mb-4">
        <label className="text-[#9929EA]">Password</label>
        <input  {...register("password")}  className="text-white border border-white md:p-2 rounded-xl" type="password" placeholder="Enter your password" />
        {errors.password && (
            <p className="text-red-400">{errors.password.message}</p>
        )}
      </div>
      <div className="flex flex-col gap-1 md:gap-2 mx-6 mb-4">
        <label className="text-[#9929EA]">Confirm Password</label>
        <input  {...register("confirmPassword")}  className="text-white border border-white md:p-2 rounded-xl" type="password" placeholder="Enter your password" />
        {errors.password && (
            <p className="text-red-400">{errors.password.message}</p>
        )}
      </div>
      <div className="flex flex-col gap-1 md:gap-2 mx-6 mb-4">
        <label className="text-[#9929EA]">Profile image</label>
        <input  {...register("profileImage")}  className="text-white border border-white md:p-2 hover:bg-[#131313] hover:cursor-pointer rounded-xl" type="file" />
        {errors.profileImage && (
            <p className="text-red-400">{errors.profileImage.message}</p>
        )}  
      </div>
      {serverError && (
        <p className="text-red-400 text-sm mx-6 mb-2">{serverError}</p>
      )}
      <div className="flex flex-col gap-1 md:gap-2 mx-6 mb-4">
        <button type="submit" disabled={isSubmitting} 
                className="bg-[#9929EA] text-white py-2 rounded-xl hover:cursor-pointer">
          {isSubmitting ? "Registering..." : "Register"}           
        </button>
      </div>
    </form>
  )
}

export default RegisterUserForm