import { Client } from './Client';
import { Animal } from './Animal';
import { Fornecedor } from './Fornecedor';
import { ProdutoFornecedor } from './ProdutoFornecedor';
import { PedidoCompra } from './PedidoCompra';
import { PedidoCompraItem } from './PedidoCompraItem';
import { Admin } from './Admin';

// Client - Animal
Client.hasMany(Animal, { foreignKey: 'clienteId', as: 'animais' });
Animal.belongsTo(Client, { foreignKey: 'clienteId', as: 'cliente' });

// Fornecedor - ProdutoFornecedor
Fornecedor.hasMany(ProdutoFornecedor, { foreignKey: 'fornecedorId', as: 'catalogo' });
ProdutoFornecedor.belongsTo(Fornecedor, { foreignKey: 'fornecedorId', as: 'fornecedor' });

// Fornecedor/Admin - PedidoCompra
Fornecedor.hasMany(PedidoCompra, { foreignKey: 'fornecedorId', as: 'pedidos' });
PedidoCompra.belongsTo(Fornecedor, { foreignKey: 'fornecedorId', as: 'fornecedor' });

Admin.hasMany(PedidoCompra, { foreignKey: 'adminId', as: 'pedidos' });
PedidoCompra.belongsTo(Admin, { foreignKey: 'adminId', as: 'admin' });

// PedidoCompra - PedidoCompraItem
PedidoCompra.hasMany(PedidoCompraItem, { foreignKey: 'pedidoId', as: 'itens' });
PedidoCompraItem.belongsTo(PedidoCompra, { foreignKey: 'pedidoId', as: 'pedido' });

// ProdutoFornecedor - PedidoCompraItem
ProdutoFornecedor.hasMany(PedidoCompraItem, { foreignKey: 'produtoFornecedorId', as: 'itens' });
PedidoCompraItem.belongsTo(ProdutoFornecedor, { foreignKey: 'produtoFornecedorId', as: 'produtoFornecedor' });
