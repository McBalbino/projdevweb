import { Request, Response } from 'express';
import { AdminRepository } from '../repositories/AdminRepository';

const repo = new AdminRepository();

export class AdminController {
  async create(req: Request, res: Response) {
    const admin = await repo.create(req.body);
    res.json(admin);
  }

  async list(req: Request, res: Response) {
    const admins = await repo.findAll();
    res.json(admins);
  }
}