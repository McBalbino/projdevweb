
import { api } from './http'
export type Client = { id:number; nome:string; email:string; telefone:string; tipo:string }
export const Clients = { list: () => api.get<Client[]>('/clients').then(r=>r.data) }
