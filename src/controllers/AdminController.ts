import { Request, Response } from 'express';
import { Admin } from '../models/Admin';

export class AdminController {
  async create(req: Request, res: Response) {
    const admin = await Admin.create(req.body);
    res.status(201).json(admin);
  }
  async list(req: Request, res: Response) {
    const admins = await Admin.findAll();
    res.json(admins);
  }
  async show(req: Request, res: Response) {
    const admin = await Admin.findByPk(Number(req.params.id));
    if (!admin) return res.status(404).json({ erro: 'Admin não encontrado' });
    res.json(admin);
  }
  async update(req: Request, res: Response) {
    const admin = await Admin.findByPk(Number(req.params.id));
    if (!admin) return res.status(404).json({ erro: 'Admin não encontrado' });
    await admin.update(req.body);
    res.json(admin);
  }
  async delete(req: Request, res: Response) {
    await Admin.destroy({ where: { id: Number(req.params.id) } });
    res.json({ mensagem: 'Admin removido' });
  }
}
