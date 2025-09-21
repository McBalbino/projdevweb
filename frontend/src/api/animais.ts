
import { api } from './http'

export type Animal = {
  id: number
  nome: string
  especie: string
  raca: string
  idade: number | null
  clienteId: number
}

export type AnimalPayload = {
  nome: string
  especie: string
  raca: string
  clienteId: number
  idade?: number | null
}

export const Animais = {
  list: () => api.get<Animal[]>('/animais').then(r=>r.data),
  listMine: (clienteId: number) => api.get<Animal[]>('/animais').then(r=>r.data.filter(a=>a.clienteId===clienteId)),
  create: (a: AnimalPayload) => api.post<Animal>('/animais', a).then(r=>r.data),
  update: (id:number, patch: Partial<AnimalPayload>) => api.put<Animal>(`/animais/${id}`, patch).then(r=>r.data),
  remove: (id:number) => api.delete(`/animais/${id}`).then(r=>r.data),
}
