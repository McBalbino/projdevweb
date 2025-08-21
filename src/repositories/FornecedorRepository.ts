import { Fornecedor, FornecedorCreationAttributes } from '../models/Fornecedor';

export class FornecedorRepository {
  create(data: FornecedorCreationAttributes) { return Fornecedor.create(data as any); }
  findAll() { return Fornecedor.findAll(); }
  findById(id: number) { return Fornecedor.findByPk(id); }
  update(id: number, data: Partial<Fornecedor>) { return Fornecedor.update(data, { where: { id } }); }
  delete(id: number) { return Fornecedor.destroy({ where: { id } }); }
}
