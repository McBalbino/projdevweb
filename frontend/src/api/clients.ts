
import { api } from './http'
export type Client = { id:number; nome:string; email:string; telefone:string; tipo:string }
export const Clients = {
  list: () => api.get<Client[]>('/clients').then(r=>r.data),
  get: (id:number) => api.get<Client>(`/clients/${id}`).then(r=>r.data),
  create: (c: Partial<Client>) => api.post<Client>('/clients', c).then(r=>r.data),
  update: (id:number, c: Partial<Client>) => api.put<Client>(`/clients/${id}`, c).then(r=>r.data),
  remove: (id:number) => api.delete(`/clients/${id}`),
}
