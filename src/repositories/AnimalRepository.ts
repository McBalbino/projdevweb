import { Animal, AnimalCreationAttributes } from '../models/Animal';

export class AnimalRepository {
  async create(data: AnimalCreationAttributes) {
    return Animal.create(data);
  }

  async findAll() {
    return Animal.findAll({ include: { all: true } });
  }

  async findById(id: number) {
    return Animal.findByPk(id);
  }

  async update(id: number, data: Partial<Animal>) {
    return Animal.update(data, { where: { id } });
  }

  async delete(id: number) {
    return Animal.destroy({ where: { id } });
  }
}