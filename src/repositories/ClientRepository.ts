import { Client, ClientCreationAttributes } from '../models/Client';

export class ClientRepository {
  async create(data: ClientCreationAttributes) {
    return Client.create(data);
  }

  async findAll() {
    return Client.findAll({ include: { all: true } });
  }
}
