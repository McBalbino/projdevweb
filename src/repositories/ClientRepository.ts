import { Client, ClientCreationAttributes } from '../models/Client';

export class ClientRepository {
  async create(data: ClientCreationAttributes) {
    return Client.create(data);
  }

  async findAll() {
    return Client.findAll({ include: { all: true } });
  }

  async findById(id: number) {
    return Client.findByPk(id);
  }

  async update(id: number, data: Partial<Client>) {
    return Client.update(data, { where: { id } });
  }

  async delete(id: number) {
    return Client.destroy({ where: { id } });
  }
}