import { Link } from "react-router-dom"
import LoginUserForm from "../components/AuthPageComponent/LoginUserForm"
import AuthLayout from "../components/layout/AuthLayout"

const LoginPage = () => {
  return (
    <AuthLayout title="Вход">
      <LoginUserForm />
      <p className="mt-4 text-center text-sm text-muted">
        Нет аккаунта?{" "}
        <Link to="/register" className="font-medium text-accent underline underline-offset-2">
          Создать аккаунт
        </Link>
      </p>
    </AuthLayout>
  )
}

export default LoginPage
