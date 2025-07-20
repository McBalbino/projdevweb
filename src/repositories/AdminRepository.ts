import { Admin, AdminCreationAttributes } from '../models/Admin';

export class AdminRepository {
  async create(data: AdminCreationAttributes) {
    return Admin.create(data);
  }

  async findAll() {
    return Admin.findAll();
  }
}
