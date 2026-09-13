import LoginUserForm from "../components/AuthPageComponent/LoginUserForm"
import { Link } from "react-router-dom"

const LoginPage = () => {
  return (
    <div className="flex flex-col items-center md:gap-10 h-screen">
      <div className="flex flex-col items-center gap-5 md: pt-15">
        <h1 className="md: text-5xl font-bold text-[#9929EA]">Welcome To ConnectHub</h1>
        <p className="text-white md:text-2xl"> A Place To Flex Your Creation</p>
      </div>
      <div className="flex flex-col border border-white md:w-1/2 mt-10 pt-5 rounded-xl shadow-2xl shadow-[#230737]">
        <h1 className="text-white text-xl mx-auto">Login to your account</h1>
        <LoginUserForm />
        <div className="text-white mx-auto mb-8">
          <Link to="/register">Do not have an account?</Link>
        </div>
      </div>      
    </div>    
  )
}

export default LoginPage