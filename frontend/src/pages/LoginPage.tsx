import { Link } from "react-router-dom"
import LoginUserForm from "../components/AuthPageComponent/LoginUserForm"
import AuthCard from "../components/ui/AuthCard"

const LoginPage = () => {
  return (
    <div className="flex min-h-dvh flex-col items-center px-4 pb-[calc(1.5rem+env(safe-area-inset-bottom))] pt-[calc(2.5rem+env(safe-area-inset-top))]">
      <div className="mb-8 flex flex-col items-center gap-2 text-center">
        <h1 className="text-3xl font-bold text-brand md:text-5xl">ConnectHub</h1>
        <p className="text-sm text-neutral-300 md:text-lg">A place to flex your creation</p>
      </div>
      <AuthCard title="Login to your account">
        <LoginUserForm />
        <p className="mt-2 text-center text-sm text-neutral-300">
          Do not have an account?{" "}
          <Link to="/register" className="font-semibold text-brand underline underline-offset-2">
            Sign up
          </Link>
        </p>
      </AuthCard>
    </div>
  )
}

export default LoginPage
