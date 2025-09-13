
import { Request, Response } from 'express'
import { ConsultaService } from '../services/consultaService'

export class ConsultaController {
  async create(req: Request, res: Response) {
    const usuario:any = (req as any).usuario
    // cliente só cria para si mesmo
    const data = { ...req.body, clienteId: usuario.tipo==='cliente' ? usuario.id : (req.body.clienteId ?? usuario.id) }
    if (!data.clienteId || !data.animalId || !data.tipo || !data.data) {
      return res.status(400).json({ erro: 'Campos obrigatórios: clienteId, animalId, tipo, data' })
    }
    const created = await ConsultaService.create(data)
    res.status(201).json(created)
  }

  async listAll(req: Request, res: Response) {
    const lst = await ConsultaService.listAll()
    res.json(lst)
  }

  async listMine(req: Request, res: Response) {
    const usuario:any = (req as any).usuario
    const lst = await ConsultaService.listByCliente(usuario.id)
    res.json(lst)
  }

  async update(req: Request, res: Response) {
    const usuario:any = (req as any).usuario
    const id = Number(req.params.id)
    const existing = await ConsultaService.get(id)
    if (!existing) return res.status(404).json({ erro: 'Consulta não encontrada' })
    if (usuario.tipo !== 'admin' && existing.clienteId !== usuario.id) {
      return res.status(403).json({ erro: 'Sem permissão' })
    }
    const updated = await ConsultaService.update(id, req.body)
    res.json(updated)
  }

  async remove(req: Request, res: Response) {
    const usuario:any = (req as any).usuario
    const id = Number(req.params.id)
    const existing = await ConsultaService.get(id)
    if (!existing) return res.status(404).json({ erro: 'Consulta não encontrada' })
    if (usuario.tipo !== 'admin' && existing.clienteId !== usuario.id) {
      return res.status(403).json({ erro: 'Sem permissão' })
    }
    await ConsultaService.remove(id)
    res.json({ ok: true })
  }
}
