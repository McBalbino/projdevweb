import { Request, Response } from 'express';
import { PedidoCompraService } from '../services/pedidoCompraService';

export class PedidoCompraController {
  async create(req: Request, res: Response) {
    try {
      const adminId = (req as any).usuario.id;
      const { fornecedorId, itens } = req.body;
      const ped = await PedidoCompraService.criarPedido(Number(adminId), Number(fornecedorId), itens);
      res.status(201).json(ped);
    } catch (e: any) {
      res.status(400).json({ erro: e.message });
    }
  }
  async list(req: Request, res: Response) {
    const lst = await PedidoCompraService.listar();
    res.json(lst);
  }
  async show(req: Request, res: Response) {
    const ped = await PedidoCompraService.obter(Number(req.params.id));
    if (!ped) return res.status(404).json({ erro: 'Pedido não encontrado' });
    res.json(ped);
  }
  async status(req: Request, res: Response) {
    try {
      const ped = await PedidoCompraService.atualizarStatus(Number(req.params.id), req.body.status);
      res.json(ped);
    } catch (e: any) {
      res.status(400).json({ erro: e.message });
    }
  }
  async receber(req: Request, res: Response) {
    try {
      const ped = await PedidoCompraService.receberPedido(Number(req.params.id));
      res.json(ped);
    } catch (e: any) {
      res.status(400).json({ erro: e.message });
    }
  }
}
