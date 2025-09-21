import { Request, Response } from 'express';
import { Animal } from '../models/Animal';

export class AnimalController {
  async create(req: Request, res: Response) {
    const usuario: any = (req as any).usuario;
    const payload = {
      nome: req.body.nome,
      especie: req.body.especie,
      clienteId: usuario?.tipo === 'cliente' ? Number(usuario.id) : Number(req.body.clienteId),
    };
    if (!payload.nome || !payload.especie || !payload.clienteId) {
      return res.status(400).json({ erro: 'Campos obrigatórios: nome, especie, clienteId' });
    }
    const a = await Animal.create(payload);
    res.status(201).json(a);
  }
  async list(req: Request, res: Response) {
    const usuario: any = (req as any).usuario;
    const lst = await Animal.findAll(
      usuario?.tipo === 'admin'
        ? {}
        : { where: { clienteId: Number(usuario.id) } }
    );
    res.json(lst);
  }
  async show(req: Request, res: Response) {
    const a = await Animal.findByPk(Number(req.params.id));
    if (!a) return res.status(404).json({ erro: 'Animal não encontrado' });
    const usuario: any = (req as any).usuario;
    if (usuario?.tipo !== 'admin' && a.clienteId !== Number(usuario.id)) {
      return res.status(403).json({ erro: 'Sem permissão para acessar este animal' });
    }
    res.json(a);
  }
  async update(req: Request, res: Response) {
    const a = await Animal.findByPk(Number(req.params.id));
    if (!a) return res.status(404).json({ erro: 'Animal não encontrado' });
    const usuario: any = (req as any).usuario;
    if (usuario?.tipo !== 'admin' && a.clienteId !== Number(usuario.id)) {
      return res.status(403).json({ erro: 'Sem permissão para alterar este animal' });
    }
    const patch = usuario?.tipo === 'admin'
      ? req.body
      : {
          nome: req.body.nome ?? a.nome,
          especie: req.body.especie ?? a.especie,
          clienteId: a.clienteId,
        };
    await a.update(patch);
    res.json(a);
  }
  async delete(req: Request, res: Response) {
    const a = await Animal.findByPk(Number(req.params.id));
    if (!a) return res.status(404).json({ erro: 'Animal não encontrado' });
    const usuario: any = (req as any).usuario;
    if (usuario?.tipo !== 'admin' && a.clienteId !== Number(usuario.id)) {
      return res.status(403).json({ erro: 'Sem permissão para remover este animal' });
    }
    await Animal.destroy({ where: { id: Number(req.params.id) } });
    res.json({ mensagem: 'Animal removido' });
  }
}
