import sequelize from '../config/database';
import { PedidoCompra } from '../models/PedidoCompra';
import { PedidoCompraItem } from '../models/PedidoCompraItem';
import { Produto } from '../models/Produto';
import { ProdutoFornecedor } from '../models/ProdutoFornecedor';

export class PedidoCompraService {
  static async criarPedido(adminId: number, fornecedorId: number, itens: Array<{ produtoFornecedorId: number; quantidade: number; precoUnitario?: number }>) {
    return await sequelize.transaction(async (t) => {
      const pedido = await PedidoCompra.create({ adminId, fornecedorId }, { transaction: t });

      let total = 0;
      for (const item of itens) {
        const pf = await ProdutoFornecedor.findByPk(item.produtoFornecedorId, { transaction: t });
        if (!pf) throw new Error(`ProdutoFornecedor ${item.produtoFornecedorId} não encontrado`);
        const precoUnitario = item.precoUnitario ?? Number(pf.preco);
        const subtotal = Number(precoUnitario) * Number(item.quantidade);
        total += subtotal;
        await PedidoCompraItem.create(
          {
            pedidoId: Number(pedido.id),
            produtoFornecedorId: Number(pf.id),
            quantidade: Number(item.quantidade),
            precoUnitario: Number(precoUnitario),
            subtotal: Number(subtotal),
          },
          { transaction: t }
        );
      }

      await pedido.update({ total }, { transaction: t });
      return pedido;
    });
  }

  static listar() { return PedidoCompra.findAll({ order: [['createdAt','DESC']] }); }
  static obter(id: number) { return PedidoCompra.findByPk(id, { include: { all: true } }); }

  static async atualizarStatus(id: number, status: 'APROVADO'|'ENVIADO'|'RECEBIDO'|'CANCELADO') {
    const pedido = await PedidoCompra.findByPk(id);
    if (!pedido) throw new Error('Pedido não encontrado');
    await pedido.update({ status });
    return pedido;
  }

  static async receberPedido(id: number) {
    return await sequelize.transaction(async (t) => {
      const pedido = await PedidoCompra.findByPk(id);
      if (!pedido) throw new Error('Pedido não encontrado');

      const itens = await PedidoCompraItem.findAll({ where: { pedidoId: id }, transaction: t });
      for (const it of itens) {
        const pf = await ProdutoFornecedor.findByPk(it.produtoFornecedorId, { transaction: t });
        if (!pf) continue;
        let prod = await Produto.findOne({ where: { sku: pf.sku }, transaction: t });
        if (!prod) {
          prod = await Produto.create({ nome: pf.nome, sku: pf.sku, preco: pf.preco, estoque: 0 }, { transaction: t });
        }
        await prod.update({ estoque: (Number(prod.estoque) || 0) + Number(it.quantidade) }, { transaction: t });
      }

      await pedido.update({ status: 'RECEBIDO' }, { transaction: t });
      return pedido;
    });
  }
}
