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
}