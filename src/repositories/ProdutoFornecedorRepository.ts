import { ProdutoFornecedor, ProdutoFornecedorCreationAttributes } from '../models/ProdutoFornecedor';

export class ProdutoFornecedorRepository {
  create(data: ProdutoFornecedorCreationAttributes) { return ProdutoFornecedor.create(data as any); }
  findAllByFornecedor(fornecedorId: number) { return ProdutoFornecedor.findAll({ where: { fornecedorId, ativo: true } }); }
  findById(id: number) { return ProdutoFornecedor.findByPk(id); }
  update(id: number, data: Partial<ProdutoFornecedor>) { return ProdutoFornecedor.update(data, { where: { id } }); }
  delete(id: number) { return ProdutoFornecedor.destroy({ where: { id } }); }
}
