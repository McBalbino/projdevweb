import { Request, Response } from 'express';
import { Animal } from '../models/Animal';

export class AnimalController {
  async create(req: Request, res: Response) {
    const a = await Animal.create(req.body);
    res.status(201).json(a);
  }
  async list(req: Request, res: Response) {
    const lst = await Animal.findAll();
    res.json(lst);
  }
  async show(req: Request, res: Response) {
    const a = await Animal.findByPk(Number(req.params.id));
    if (!a) return res.status(404).json({ erro: 'Animal não encontrado' });
    res.json(a);
  }
  async update(req: Request, res: Response) {
    const a = await Animal.findByPk(Number(req.params.id));
    if (!a) return res.status(404).json({ erro: 'Animal não encontrado' });
    await a.update(req.body);
    res.json(a);
  }
  async delete(req: Request, res: Response) {
    await Animal.destroy({ where: { id: Number(req.params.id) } });
    res.json({ mensagem: 'Animal removido' });
  }
}
