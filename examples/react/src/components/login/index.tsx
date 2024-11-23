import { useState } from 'react'

export type Credentials = Record<string, string>

interface Props {
  onSubmit: ({ username, password }: Credentials) => void
}

export default function Component({ onSubmit }: Props): React.ReactElement {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          onSubmit({ username, password })
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
    </div>
  )
}
