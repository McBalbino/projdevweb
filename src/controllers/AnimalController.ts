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
}