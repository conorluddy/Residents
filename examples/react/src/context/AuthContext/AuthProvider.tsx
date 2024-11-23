import React from 'react'
import { AuthContext, AuthContextType } from './AuthContext'

export const AuthProvider: React.FC<{ children: React.ReactNode; value: AuthContextType }> = ({ children, value }) => {
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
