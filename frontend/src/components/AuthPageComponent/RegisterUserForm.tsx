import { zodResolver } from "@hookform/resolvers/zod"
import { registerUserSchema } from "../../schemas/auth.schema"
import type { RegisterUserFormData } from "../../schemas/auth.schema"
import { useForm } from "react-hook-form";

const RegisterUserForm = () => {
  const {register, handleSubmit, formState: { errors }} = useForm<RegisterUserFormData>({
      resolver: zodResolver(registerUserSchema)
    });
     
    const onSubmit = (data: RegisterUserFormData) => {
      console.log(data);
    }
    
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="border my-10">
      <div className="flex flex-col md:gap-2 mx-6 mb-4">
        <label className="text-[#9929EA]">Username</label>
        <input  {...register("username")}  className="text-white border border-white md:p-2 rounded-xl" type="text" placeholder="Enter your username" />
        {errors.username && (
            <p className="text-red-400">{errors.username.message}</p>
        )}
      </div>
      <div className="flex flex-col md:gap-2 mx-6 mb-4">
        <label className="text-[#9929EA]">Email</label>
        <input  {...register("email")}  className="text-white border border-white md:p-2 rounded-xl" type="email" placeholder="Enter your email" />
        {errors.email && (
            <p className="text-red-400">{errors.email.message}</p>
        )}
      </div>
      <div className="flex flex-col md:gap-2 mx-6 mb-4">
        <label className="text-[#9929EA]">Password</label>
        <input  {...register("password")}  className="text-white border border-white md:p-2 rounded-xl" type="pasword" placeholder="Enter your password" />
        {errors.password && (
            <p className="text-red-400">{errors.password.message}</p>
        )}
      </div>
      <div className="flex flex-col md:gap-2 mx-6 mb-4">
        <label className="text-[#9929EA]">Profile image</label>
        <input  {...register("profileImage")}  className="text-white border border-white md:p-2 hover:bg-[#131313] hover:cursor-pointer rounded-xl" type="file" />
        {errors.profileImage && (
            <p className="text-red-400">{errors.profileImage.message}</p>
        )}  
      </div>
      <div className="flex flex-col md:gap-2 mx-6 mb-4">
        <button type="submit" className="bg-[#9929EA] text-white md:py-2 rounded-xl hover:cursor-pointer">Register</button>
      </div>
    </form>
  )
}

export default RegisterUserForm