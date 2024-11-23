import { createContext } from 'react'
import { UserJwt } from '../../types'
import { Credentials } from '../../components/login'

export interface AuthContextType {
  jwt?: string | null
  user?: UserJwt | null
  isLoggedIn?: boolean
  isTokenExpired?: boolean
  login?: (credentials: Credentials) => Promise<void>
  refresh?: () => Promise<void>
  logout?: () => void
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)
