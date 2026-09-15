import { Link } from "react-router-dom"
import RegisterUserForm from "../components/AuthPageComponent/RegisterUserForm"
import AuthLayout from "../components/layout/AuthLayout"

const RegisterPage = () => {
  return (
    <AuthLayout title="Регистрация">
      <RegisterUserForm />
      <p className="mt-4 text-center text-sm text-muted">
        Уже есть аккаунт?{" "}
        <Link to="/login" className="font-medium text-accent underline underline-offset-2">
          Войти
        </Link>
      </p>
    </AuthLayout>
  )
}

export default RegisterPage
