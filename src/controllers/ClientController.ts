import { Request, Response } from 'express';
import { Client } from '../models/Client';

export class ClientController {
  async create(req: Request, res: Response) {
    const client = await Client.create(req.body);
    res.status(201).json(client);
  }
  async list(req: Request, res: Response) {
    const clients = await Client.findAll({ include: { all: true } });
    res.json(clients);
  }
  async show(req: Request, res: Response) {
    const client = await Client.findByPk(Number(req.params.id));
    if (!client) return res.status(404).json({ erro: 'Cliente não encontrado' });
    res.json(client);
  }
  async update(req: Request, res: Response) {
    const client = await Client.findByPk(Number(req.params.id));
    if (!client) return res.status(404).json({ erro: 'Cliente não encontrado' });
    await client.update(req.body);
    res.json(client);
  }
  async delete(req: Request, res: Response) {
    await Client.destroy({ where: { id: Number(req.params.id) } });
    res.json({ mensagem: 'Cliente removido' });
  }
}
