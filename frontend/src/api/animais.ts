
import { api } from './http'
export type Animal = { id:number; nome:string; especie:string; clienteId:number }
export const Animais = {
  list: () => api.get<Animal[]>('/animais').then(r=>r.data),
  get: (id:number) => api.get<Animal>(`/animais/${id}`).then(r=>r.data),
  create: (a: Partial<Animal>) => api.post<Animal>('/animais', a).then(r=>r.data),
  update: (id:number, a: Partial<Animal>) => api.put<Animal>(`/animais/${id}`, a).then(r=>r.data),
  remove: (id:number) => api.delete(`/animais/${id}`),
}
