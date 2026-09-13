import { useSelector } from "react-redux"
import type { RootState } from "../store/store"
import Spinner from "../components/ui/Spinner"

const HomePage = () => {
  const user = useSelector((state: RootState) => state.auth.user)  
  const  { loading } = useSelector((state: RootState) => state.auth)
  return (
    <div>
      {loading? (
      <Spinner />
        ):( 
        user? (
          <h1 className="text-blue-500">Welcome, {user.name}</h1>
          ):
          (
          <h1 className="text-red-500">You are not logged in</h1>
        ))
      }
    </div>
  )
} 

export default HomePage