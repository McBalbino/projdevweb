
import { api } from './http'

export type ConsultaStatus = 'AGENDADA'|'CONCLUIDA'|'CANCELADA'
export type Consulta = {
  id:number
  clienteId:number
  animalId:number
  tipo:string
  data:string // ISO
  observacoes?: string
  status: ConsultaStatus
}

export const Consultas = {
  list: () => api.get<Consulta[]>('/consultas').then(r=>r.data),
  listMine: (clienteId:number) => api.get<Consulta[]>('/consultas').then(r=>r.data.filter(c=>c.clienteId===clienteId)),
  create: (c: Omit<Consulta,'id'|'status'> & { status?: ConsultaStatus }) => api.post<Consulta>('/consultas', { status:'AGENDADA', ...c }).then(r=>r.data),
  update: (id:number, patch: Partial<Consulta>) => api.put<Consulta>(`/consultas/${id}`, patch).then(r=>r.data),
  remove: (id:number) => api.delete(`/consultas/${id}`).then(r=>r.data),
}
