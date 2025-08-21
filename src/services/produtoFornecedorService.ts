import { ProdutoFornecedor } from '../models/ProdutoFornecedor';

export class ProdutoFornecedorService {
  static obter(id: number) { return ProdutoFornecedor.findByPk(id); }
  static atualizar(id: number, data: Partial<ProdutoFornecedor>) { return ProdutoFornecedor.update(data, { where: { id } }); }
  static desativar(id: number) { return ProdutoFornecedor.update({ ativo: false }, { where: { id } }); }
}
