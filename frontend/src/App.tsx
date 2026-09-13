import { Routes, Route} from 'react-router-dom'
import RegisterPage from './pages/RegisterPage'
import LoginPage from './pages/LoginPage'
import { Toaster } from './components/ui/Toast'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import HomePage from './pages/HomePage'
import { getCurrentUser } from './services/auth.service'
import { setUser, setAuthLoad } from './store/slices/authSlice'
import type { RootState } from './store/store'

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const loadUser = async() => {
      try{
        const response = await getCurrentUser();
        dispatch(setUser(response.user));
      } catch(error){
        console.log(error)
      } finally {
        dispatch(setAuthLoad())
      }
    }
    loadUser()
  },[dispatch]);
 
  return (
    <>
      <Toaster />
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/register' element={<RegisterPage />} />
        <Route path='/login' element={<LoginPage />} />
      </Routes>
    </>
  )
}

export default App
