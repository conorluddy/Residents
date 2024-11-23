import './App.css'
import Login, { Credentials } from './components/login'

function App(): React.ReactElement {
  return <Login onSubmit={handleLogin} />
}

export default App

async function handleLogin(credentials: Credentials): Promise<void> {
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
      throw new Error(`Response status: ${response.status}`)
    }

    const json = await response.json()

    // eslint-disable-next-line no-console
    console.log(json)
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error)
  }
}
