import React, { useCallback, useEffect, useMemo, useState } from 'react'
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
  const logout = useCallback(async () => {
    const url = 'http://localhost:3000/auth/logout'
    try {
      await fetch(url, { method: 'GET', credentials: 'include' })
      setJwt(null)
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error)
    }
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

  // Google redirects us back to the app with a token param when login succeeds, so we pick it up here
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const token = params.get('token')
    if (token) {
      // Remove the token from the URL
      window.history.replaceState({}, document.title, window.location.pathname)
      setJwt(token)
    }
  }, [])

  return (
    <AuthContext.Provider value={{ jwt, user, isLoggedIn, isTokenExpired, login, logout, refresh }}>
      {children}
    </AuthContext.Provider>
  )
}
