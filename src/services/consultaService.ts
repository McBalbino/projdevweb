
import { Consulta } from '../models/Consulta'

export class ConsultaService {
  static async create(data: any) {
    return await Consulta.create(data)
  }
  static async listAll() {
    return await Consulta.findAll({ order:[['data','ASC']] })
  }
  static async listByCliente(clienteId:number) {
    return await Consulta.findAll({ where: { clienteId }, order:[['data','ASC']] })
  }
  static async get(id:number) {
    return await Consulta.findByPk(id)
  }
  static async update(id:number, patch:any) {
    const c = await Consulta.findByPk(id)
    if (!c) return null
    return await c.update(patch)
  }
  static async remove(id:number) {
    const c = await Consulta.findByPk(id)
    if (!c) return null
    await c.destroy()
    return true
  }
}
