
import { api } from './http'
export type StatusPedido = 'ABERTO'|'APROVADO'|'ENVIADO'|'RECEBIDO'|'CANCELADO'
export type PedidoCompraItemInput = { produtoFornecedorId:number; quantidade:number; precoUnitario?:number }
export type PedidoCompra = { id:number; fornecedorId:number; adminId:number; status:StatusPedido; total:number; createdAt?:string; updatedAt?:string }
export const Pedidos = {
  create: (fornecedorId:number, itens:PedidoCompraItemInput[]) => api.post<PedidoCompra>('/pedidos-compra', { fornecedorId, itens }).then(r=>r.data),
  list: () => api.get<PedidoCompra[]>('/pedidos-compra').then(r=>r.data),
  get: (id:number) => api.get<PedidoCompra>(`/pedidos-compra/${id}`).then(r=>r.data),
  setStatus: (id:number, status:StatusPedido) => api.patch<PedidoCompra>(`/pedidos-compra/${id}/status`, { status }).then(r=>r.data),
  receber: (id:number) => api.post<PedidoCompra>(`/pedidos-compra/${id}/receber`, {}).then(r=>r.data),
}
