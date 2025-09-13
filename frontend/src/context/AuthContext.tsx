
import React, { createContext, useContext, useEffect, useState } from 'react'
import { login as apiLogin, registrarCliente, AuthUser } from '@/api/auth'
import { setAuthToken } from '@/api/http'

type Ctx = {
  user?: AuthUser
  login: (email:string, senha:string)=>Promise<void>
  signup: (nome:string, email:string, senha:string, telefone?:string)=>Promise<void>
  logout: ()=>void
}
const AuthCtx = createContext<Ctx>({} as any)
export const useAuth = ()=>useContext(AuthCtx)

export function AuthProvider({ children }:{children:React.ReactNode}) {
  const [user, setUser] = useState<AuthUser>()

  useEffect(()=>{
    const raw = localStorage.getItem('auth')
    if (raw) { const u = JSON.parse(raw) as AuthUser; setUser(u); setAuthToken(u.token) }
  },[])

  const login = async (email:string, senha:string) => {
    const u = await apiLogin(email, senha)
    setUser(u); setAuthToken(u.token); localStorage.setItem('auth', JSON.stringify(u))
  }
  const signup = async (nome:string, email:string, senha:string, telefone?:string) => {
    await registrarCliente({ nome, email, senha, telefone })
  }
  const logout = () => { setUser(undefined); setAuthToken(undefined); localStorage.removeItem('auth') }

  return <AuthCtx.Provider value={{ user, login, signup, logout }}>{children}</AuthCtx.Provider>
}
