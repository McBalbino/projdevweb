import { Request, Response } from 'express';
import { ProdutoFornecedorService } from '../services/produtoFornecedorService';

export class ProdutoFornecedorController {
  async update(req: Request, res: Response) {
    await ProdutoFornecedorService.atualizar(Number(req.params.id), req.body);
    res.json({ mensagem: 'Produto do fornecedor atualizado' });
  }
  async disable(req: Request, res: Response) {
    await ProdutoFornecedorService.desativar(Number(req.params.id));
    res.json({ mensagem: 'Produto do fornecedor desativado' });
  }
}
