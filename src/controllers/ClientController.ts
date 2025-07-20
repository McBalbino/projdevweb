import { Request, Response } from 'express';
import { ClientRepository } from '../repositories/ClientRepository';

const repo = new ClientRepository();

export class ClientController {
  async create(req: Request, res: Response) {
    const client = await repo.create(req.body);
    res.json(client);
  }

  async list(req: Request, res: Response) {
    const clients = await repo.findAll();
    res.json(clients);
  }

  async show(req: Request, res: Response) {
    const client = await repo.findById(Number(req.params.id));
    res.json(client);
  }

  async update(req: Request, res: Response) {
    await repo.update(Number(req.params.id), req.body);
    res.json({ message: 'Cliente atualizado com sucesso.' });
  }

  async delete(req: Request, res: Response) {
    await repo.delete(Number(req.params.id));
    res.json({ message: 'Cliente removido com sucesso.' });
  }
}