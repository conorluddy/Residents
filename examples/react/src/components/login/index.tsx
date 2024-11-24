import { useState } from 'react'
import { useAuth } from '../../context/AuthContext/useAuth'

export type Credentials = Record<string, string>

export default function Component(): React.ReactElement {
  const { isLoggedIn } = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const { login } = useAuth()

  if (isLoggedIn) {
    return <></>
  }

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          login?.({ username, password })
        }}
      >
        <div>
          <label htmlFor="username">Username</label>
          <div>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              required
            />
          </div>
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <div className="relative">
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
            />
          </div>
        </div>
        <button type="submit">Log in</button>
      </form>

      {/* {errorMessage && <strong>{errorMessage}</strong>} */}

      <pre>resident / R351D3NT!zero</pre>

      <a href="http://localhost:3000/auth/google">Log in with Google</a>
    </div>
  )
}
