import { ClientRepository } from '../repositories/ClientRepository';

export class ClientService {
  private repo: ClientRepository;

  constructor() {
    this.repo = new ClientRepository();
  }

  async create(data: any) {
    return await this.repo.create(data);
  }

  async findAll() {
    return await this.repo.findAll();
  }

  async findById(id: number) {
    return await this.repo.findById(id);
  }

  async update(id: number, data: any) {
    await this.repo.update(id, data);
    return { message: 'Cliente atualizado com sucesso.' };
  }

  async delete(id: number) {
    await this.repo.delete(id);
    return { message: 'Cliente removido com sucesso.' };
  }
}