import { useAuth } from '../../context/AuthContext/useAuth'

export default function Component(): React.ReactElement {
  const { user, isTokenExpired, isLoggedIn, logout, refresh } = useAuth()

  return (
    <header>
      {user?.exp && <h3>Auth Expires: {new Date(user.exp * 1000).toUTCString()}</h3>}

      <button type="button" onClick={refresh}>
        Refresh Token
        <small>
          <br />[{isTokenExpired ? 'Token has expired' : 'Token is okay'}]
        </small>
      </button>

      {isLoggedIn && (
        <button type="button" onClick={logout}>
          Log out
        </button>
      )}
    </header>
  )
}
