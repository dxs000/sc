import { Routes, Route} from 'react-router-dom'
import RegisterPage from './pages/RegisterPage'
import LoginPage from './pages/LoginPage'
import { Toaster } from './components/ui/Toast'
import HomePage from './pages/HomePage'

const App = () => {
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
