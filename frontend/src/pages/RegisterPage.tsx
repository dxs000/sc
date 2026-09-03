import { Link } from "react-router-dom"
import RegisterUserForm from "../components/AuthPageComponent/RegisterUserForm"


const RegisterPage = () => {
  return (
    <div className="flex flex-col items-center md:gap-10 bg-[#000000] min-h-screen pb-10">
      <div className="flex flex-col items-center gap-5 md: pt-15">
        <h1 className="md: text-5xl font-bold text-[#9929EA]">Welcome To ConnectHub</h1>
        <p className="text-white md:text-2xl"> A Place To Flex Your Creation</p>
      </div>
      <div className="flex flex-col border border-white md:w-1/2 mt-10 pt-5 rounded-xl shadow-2xl shadow-[#230737]">
        <h1 className="text-white text-xl mx-auto">Create your account</h1>
        <RegisterUserForm />
        <div className="text-white mx-auto mb-8">
          <Link to="/login">Already have an account?</Link>
        </div>
      </div>      
    </div>    
  )
}

export default RegisterPage