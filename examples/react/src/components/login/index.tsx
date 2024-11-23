import { useCallback, useState } from 'react'
import { jwtDecode } from 'jwt-decode'
import { UserJwt } from '../../types'

export type Credentials = Record<string, string>

interface Props {
  onSuccess: (jwt: string, user: UserJwt) => void
  onError: (message: string) => void
}

export default function Component({ onSuccess, onError }: Props): React.ReactElement {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleLogin = useCallback(async (credentials: Credentials): Promise<void> => {
    const url = 'http://localhost:3000/auth'
    try {
      const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(credentials),
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        const { message } = (await response.json()) as Record<'message', string>
        onError(message)
        setErrorMessage(message)
        throw new Error(`Response status: ${response.status}`)
      }

      const { token } = await response.json()
      const decodedUser = jwtDecode(token)

      onSuccess(token, decodedUser as UserJwt)
      setErrorMessage(null)
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error)
    }
  }, [])

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          handleLogin({ username, password })
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

      {errorMessage && <strong>{errorMessage}</strong>}

      <pre>resident / R351D3NT!zero</pre>
    </div>
  )
}
