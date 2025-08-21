import { Fornecedor } from '../models/Fornecedor';
import { ProdutoFornecedor } from '../models/ProdutoFornecedor';

export class FornecedorService {
  static async criarFornecedor(data: Partial<Fornecedor>) {
    const ja = await Fornecedor.findOne({ where: { cnpj: data.cnpj } as any });
    if (ja) throw new Error('CNPJ já cadastrado.');
    return Fornecedor.create(data as any);
  }
  static listar() { return Fornecedor.findAll(); }
  static obter(id: number) { return Fornecedor.findByPk(id); }
  static atualizar(id: number, data: Partial<Fornecedor>) { return Fornecedor.update(data, { where: { id } }); }
  static remover(id: number) { return Fornecedor.destroy({ where: { id } }); }
  static adicionarProduto(fornecedorId: number, data: Partial<ProdutoFornecedor>) {
    return ProdutoFornecedor.create({ ...data, fornecedorId } as any);
  }
  static listarProdutos(fornecedorId: number) {
    return ProdutoFornecedor.findAll({ where: { fornecedorId, ativo: true } });
  }
}
