import React, { useCallback, useMemo, useState } from 'react'
import { AuthContext, AuthContextType } from './AuthContext'
import { UserJwt } from '../../types'
import { jwtDecode } from 'jwt-decode'
import { Credentials } from '../../components/login'

export const AuthProvider: React.FC<{ children: React.ReactNode; value: AuthContextType }> = ({ children, value }) => {
  const [jwt, setJwt] = useState(value.jwt)

  /**
   * login
   */
  const login = useCallback(async (credentials: Credentials): Promise<void> => {
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
      const { token } = await response.json()
      setJwt(token)
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error)
    }
  }, [])

  /**
   * logout
   */
  const logout = useCallback(() => {
    setJwt(null)
    // These are secure cookies, so can't be accessed by the client, so
    // we need to call the logout endpoint and server will nuke them...
    // document.cookie = 'refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
    // document.cookie = 'residentToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
    // document.cookie = 'xsrfToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
  }, [setJwt])

  /**
   * refresh
   */
  const refresh = useCallback(async (): Promise<void> => {
    const url = 'http://localhost:3000/auth/refresh'
    try {
      const response = await fetch(url, {
        method: 'POST',
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`)
      }

      const { token } = await response.json()
      setJwt(token)
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error)
    }
  }, [jwt])

  /**
   * user
   */
  const user = useMemo(() => {
    if (jwt) {
      try {
        return jwtDecode<UserJwt>(jwt)
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Failed to decode JWT:', error)
      }
      return null
    }
  }, [jwt])

  const isLoggedIn = !!user?.role
  const isTokenExpired = !user || user.exp < Date.now() / 1000

  return (
    <AuthContext.Provider value={{ jwt, user, isLoggedIn, isTokenExpired, login, logout, refresh }}>
      {children}
    </AuthContext.Provider>
  )
}
