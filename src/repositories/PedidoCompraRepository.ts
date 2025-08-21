import { PedidoCompra, PedidoCompraCreationAttributes } from '../models/PedidoCompra';
import { PedidoCompraItem, PedidoCompraItemCreationAttributes } from '../models/PedidoCompraItem';

export class PedidoCompraRepository {
  createPedido(data: PedidoCompraCreationAttributes) { return PedidoCompra.create(data as any); }
  addItem(data: PedidoCompraItemCreationAttributes) { return PedidoCompraItem.create(data as any); }
  findById(id: number) { return PedidoCompra.findByPk(id, { include: { all: true } }); }
  list() { return PedidoCompra.findAll({ order: [['createdAt','DESC']] }); }
  update(id: number, data: Partial<PedidoCompra>) { return PedidoCompra.update(data, { where: { id } }); }
}
