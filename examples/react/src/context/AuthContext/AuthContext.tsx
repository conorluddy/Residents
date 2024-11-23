import { createContext } from 'react'
import { UserJwt } from '../../types'

export interface AuthContextType {
  jwt: string | null
  user: UserJwt | null
  logout: () => void
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)
