import { Routes, Route } from 'react-router-dom'
import RegisterPage from './pages/RegisterPage'
import LoginPage from './pages/LoginPage'
import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
import HomePage from './pages/HomePage'
import { getCurrentUser } from './services/auth.service'
import { setUser, setAuthLoad } from './store/slices/authSlice'
import ProtectedRoute from './routes/ProtectedRoute'
import PublicRoute from './routes/PublicRoute'

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const user = await getCurrentUser();
        if (user) {
          dispatch(setUser(user));
        }
      } catch (error) {
        console.log(error);
      } finally {
        dispatch(setAuthLoad());
      }
    };
    loadUser();
  }, [dispatch]);

  return (
    <Routes>
      <Route 
        path='/' 
        element={
        <ProtectedRoute>
          <HomePage />
        </ProtectedRoute>  
        } 
      />
        
      <Route 
        path='/register' 
        element={
        <PublicRoute>
          <RegisterPage />
        </PublicRoute>  
        } 
      />
      
      <Route 
        path='/login' 
        element={
        <PublicRoute>
          <LoginPage />
        </PublicRoute>    
        } 
      />
    </Routes>
  );
};

export default App;
