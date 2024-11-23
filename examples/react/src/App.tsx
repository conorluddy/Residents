import './App.css'
import Header from './components/header'
import Login from './components/login'
import Profile from './components/profile'
import { AuthProvider } from './context/AuthContext/AuthProvider'

function App(): React.ReactElement {
  return (
    <AuthProvider value={{}}>
      <Header />
      <Login />
      <Profile />
    </AuthProvider>
  )
}

export default App
