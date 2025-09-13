
import { api } from './http'

export type Animal = {
  id: number
  nome: string
  especie: string
  clienteId: number
}

export const Animais = {
  list: () => api.get<Animal[]>('/animais').then(r=>r.data),
  listMine: (clienteId: number) => api.get<Animal[]>('/animais').then(r=>r.data.filter(a=>a.clienteId===clienteId)),
  create: (a: Omit<Animal,'id'>) => api.post<Animal>('/animais', a).then(r=>r.data),
  update: (id:number, patch: Partial<Omit<Animal,'id'>>) => api.put<Animal>(`/animais/${id}`, patch).then(r=>r.data),
  remove: (id:number) => api.delete(`/animais/${id}`).then(r=>r.data),
}
