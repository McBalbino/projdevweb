import { Animal } from '../models/Animal';

export class AnimalService {
  static async getAll() {
    return await Animal.findAll();
  }

  static async getById(id: number) {
    return await Animal.findByPk(id);
  }

  static async create(data: any) {
    return await Animal.create(data);
  }

  static async update(id: number, data: any) {
    const animal = await Animal.findByPk(id);
    if (!animal) return null;
    return await animal.update(data);
  }

  static async delete(id: number) {
    const animal = await Animal.findByPk(id);
    if (!animal) return null;
    await animal.destroy();
    return true;
  }
}
