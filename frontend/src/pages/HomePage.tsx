import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import type { RootState } from "../store/store";
import { logout } from "../store/slices/authSlice";
import Spinner from "../components/ui/Spinner";

const HomePage = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user)  
  const  { loading } = useSelector((state: RootState) => state.auth)

  const handleLogout = async () => {
    try{

    } catch(error) {
      
    }
  }

  return (
    <div>
      {loading? (
      <Spinner />
        ):( 
        user? (
          <div>
            <h1 className="text-blue-500">Welcome, {user.name}</h1>
            <button onClick={handleLogout} className="text-red-700">Logout</button>
          </div>
          ):
          (
          <h1 className="text-red-500">You are not logged in</h1>
        ))
      }
      
    </div>
  )
} 

export default HomePage