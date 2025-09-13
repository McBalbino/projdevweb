
import { api } from './http'
export type Animal = { id:number; nome:string; especie:string; clienteId:number }
export const Animais = { list: () => api.get<Animal[]>('/animais').then(r=>r.data) }
