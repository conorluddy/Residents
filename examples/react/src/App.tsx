import './App.css'
import Login from './components/login'
import Profile from './components/profile'
import { AuthProvider } from './context/AuthContext/AuthProvider'
import { UserJwt } from './types'
import { useCallback, useState } from 'react'

function App(): React.ReactElement {
  const [user, setUser] = useState<UserJwt | null>(null)
  const [token, setToken] = useState<string | null>(null)

  const isLoggedIn = !!token

  const onLoginSuccess = (token: string, user: UserJwt): void => {
    setToken(token)
    setUser(user)
  }

  const onLoginError = (errorMessage: string): void => {
    // eslint-disable-next-line no-console
    console.error(errorMessage)
  }

  const logout = useCallback(() => {
    setToken(null)
    setUser(null)
  }, [])

  return (
    <AuthProvider value={{ jwt: token, user, logout }}>
      {!isLoggedIn && <Login onSuccess={onLoginSuccess} onError={onLoginError} />}

      {user?.exp && <h3>Auth Expires: {new Date(user.exp * 1000).toUTCString()}</h3>}

      {user && <Profile />}

      {isLoggedIn && (
        <button type="button" onClick={logout}>
          Log out
        </button>
      )}
    </AuthProvider>
  )
}

export default App
