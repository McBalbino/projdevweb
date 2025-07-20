import { Request, Response } from 'express';
import { AnimalRepository } from '../repositories/AnimalRepository';

const repo = new AnimalRepository();

export class AnimalController {
  async create(req: Request, res: Response) {
    const animal = await repo.create(req.body);
    res.json(animal);
  }

  async list(req: Request, res: Response) {
    const animals = await repo.findAll();
    res.json(animals);
  }

  async show(req: Request, res: Response) {
    const animal = await repo.findById(Number(req.params.id));
    res.json(animal);
  }

  async update(req: Request, res: Response) {
    await repo.update(Number(req.params.id), req.body);
    res.json({ message: 'Animal atualizado com sucesso.' });
  }

  async delete(req: Request, res: Response) {
    await repo.delete(Number(req.params.id));
    res.json({ message: 'Animal removido com sucesso.' });
  }
}