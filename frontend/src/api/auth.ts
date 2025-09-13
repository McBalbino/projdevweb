
import { api } from './http'
export type AuthUser = { id:number; nome:string; email:string; tipo:'admin'|'cliente'; token:string }
export async function login(email: string, senha: string): Promise<AuthUser> {
  const { data } = await api.post('/auth/login', { email, senha })
  return { ...data, token: data.token }
}
export async function registrarCliente(input: { nome:string; email:string; senha:string; telefone?:string }) {
  const { data } = await api.post('/auth/registrar-cliente', input)
  return data
}
