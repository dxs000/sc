import { Link } from "react-router-dom"
import LoginUserForm from "../components/AuthPageComponent/LoginUserForm"
import AuthCard from "../components/ui/AuthCard"

const LoginPage = () => {
  return (
    <div className="flex min-h-dvh flex-col items-center px-4 pb-[calc(1.5rem+env(safe-area-inset-bottom))] pt-[calc(2.5rem+env(safe-area-inset-top))]">
      <div className="mb-8 flex flex-col items-center gap-2 text-center">
        <h1 className="text-3xl font-semibold text-brand md:text-4xl">ConnectHub</h1>
        <p className="max-w-sm text-sm text-muted md:text-base">
          Consultations and discussions for clients of the financial organization
        </p>
      </div>
      <AuthCard title="Sign in">
        <LoginUserForm />
        <p className="mt-4 text-center text-sm text-muted">
          Do not have an account?{" "}
          <Link to="/register" className="font-medium text-brand underline underline-offset-2">
            Create account
          </Link>
        </p>
      </AuthCard>
    </div>
  )
}

export default LoginPage
