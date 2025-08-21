import { Request, Response } from 'express';
import { FornecedorService } from '../services/fornecedorService';

export class FornecedorController {
  async create(req: Request, res: Response) {
    try {
      const fornecedor = await FornecedorService.criarFornecedor(req.body);
      res.status(201).json(fornecedor);
    } catch (e: any) {
      res.status(400).json({ erro: e.message });
    }
  }
  async list(req: Request, res: Response) {
    const fornecedores = await FornecedorService.listar();
    res.json(fornecedores);
  }
  async show(req: Request, res: Response) {
    const f = await FornecedorService.obter(Number(req.params.id));
    if (!f) return res.status(404).json({ erro: 'Fornecedor não encontrado' });
    res.json(f);
  }
  async update(req: Request, res: Response) {
    await FornecedorService.atualizar(Number(req.params.id), req.body);
    res.json({ mensagem: 'Fornecedor atualizado' });
  }
  async delete(req: Request, res: Response) {
    await FornecedorService.remover(Number(req.params.id));
    res.json({ mensagem: 'Fornecedor removido' });
  }
  async addProduto(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const prod = await FornecedorService.adicionarProduto(Number(id), req.body);
      res.status(201).json(prod);
    } catch (e: any) {
      res.status(400).json({ erro: e.message });
    }
  }
  async listProdutos(req: Request, res: Response) {
    const { id } = req.params;
    const itens = await FornecedorService.listarProdutos(Number(id));
    res.json(itens);
  }
}
