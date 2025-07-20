import { Admin, AdminCreationAttributes } from '../models/Admin';

export class AdminRepository {
  async create(data: AdminCreationAttributes) {
    return Admin.create(data);
  }

  async findAll() {
    return Admin.findAll();
  }

  async findById(id: number) {
    return Admin.findByPk(id);
  }

  async update(id: number, data: Partial<Admin>) {
    return Admin.update(data, { where: { id } });
  }

  async delete(id: number) {
    return Admin.destroy({ where: { id } });
  }
}

