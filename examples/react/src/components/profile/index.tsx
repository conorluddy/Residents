import { useCallback, useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext/useAuth'

export default function Component(): React.ReactElement {
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [userProfile, setUserProfile] = useState<Record<string, string> | null>(null)

  const { jwt, isLoggedIn } = useAuth()

  const fetchProfile = useCallback(async (): Promise<void> => {
    const url = 'http://localhost:3000/users/self'
    try {
      const response = await fetch(url, {
        method: 'GET',
        credentials: 'include',
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      })

      if (!response.ok) {
        const { message } = (await response.json()) as Record<'message', string>
        setErrorMessage(message)
        setUserProfile(null)
        throw new Error(`Response status: ${response.status}`)
      }

      const userProfile = await response.json()
      setUserProfile(userProfile)
      setErrorMessage(null)
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error)
    }
  }, [jwt])

  useEffect(() => {
    if (isLoggedIn) {
      fetchProfile()
    }
  }, [fetchProfile, isLoggedIn])

  if (!isLoggedIn) {
    return <></>
  }

  return (
    <div>
      {userProfile && (
        <>
          {Object.entries(userProfile.user).map(([key, val]) => (
            <pre>
              {key}: {typeof val === 'string' ? val : JSON.stringify(val)}
            </pre>
          ))}
        </>
      )}

      {errorMessage && <h4>{errorMessage}</h4>}

      <button type="button" onClick={fetchProfile}>
        Refetch
      </button>
    </div>
  )
}
