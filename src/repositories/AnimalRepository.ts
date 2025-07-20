import { Animal, AnimalCreationAttributes } from '../models/Animal';

export class AnimalRepository {
  async create(data: AnimalCreationAttributes) {
    return Animal.create(data);
  }

  async findAll() {
    return Animal.findAll({ include: { all: true } });
  }
}
