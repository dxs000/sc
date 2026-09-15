import { Link } from "react-router-dom"
import RegisterUserForm from "../components/AuthPageComponent/RegisterUserForm"
import AuthCard from "../components/ui/AuthCard"

const RegisterPage = () => {
  return (
    <div className="flex min-h-dvh flex-col items-center px-4 pb-[calc(1.5rem+env(safe-area-inset-bottom))] pt-[calc(2.5rem+env(safe-area-inset-top))]">
      <div className="mb-8 flex flex-col items-center gap-2 text-center">
        <h1 className="text-3xl font-bold text-brand md:text-5xl">ConnectHub</h1>
        <p className="text-sm text-neutral-300 md:text-lg">A place to flex your creation</p>
      </div>
      <AuthCard title="Create your account">
        <RegisterUserForm />
        <p className="mt-2 text-center text-sm text-neutral-300">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-brand underline underline-offset-2">
            Log in
          </Link>
        </p>
      </AuthCard>
    </div>
  )
}

export default RegisterPage
