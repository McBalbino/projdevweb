import { Model, DataTypes, Optional, ForeignKey } from 'sequelize';
import sequelize from '../config/database';
import { PedidoCompra } from './PedidoCompra';
import { ProdutoFornecedor } from './ProdutoFornecedor';

export interface PedidoCompraItemAttributes {
  id: number;
  pedidoId: number;
  produtoFornecedorId: number;
  quantidade: number;
  precoUnitario: number;
  subtotal: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface PedidoCompraItemCreationAttributes extends Optional<PedidoCompraItemAttributes, 'id' | 'subtotal'> {}

export class PedidoCompraItem extends Model<PedidoCompraItemAttributes, PedidoCompraItemCreationAttributes>
  implements PedidoCompraItemAttributes {
  public id!: number;
  public pedidoId!: ForeignKey<PedidoCompra['id']>;
  public produtoFornecedorId!: ForeignKey<ProdutoFornecedor['id']>;
  public quantidade!: number;
  public precoUnitario!: number;
  public subtotal!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

PedidoCompraItem.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    pedidoId: { type: DataTypes.INTEGER, allowNull: false },
    produtoFornecedorId: { type: DataTypes.INTEGER, allowNull: false },
    quantidade: { type: DataTypes.INTEGER, allowNull: false },
    precoUnitario: { type: DataTypes.DECIMAL(10,2), allowNull: false },
    subtotal: { type: DataTypes.DECIMAL(12,2), allowNull: false, defaultValue: 0 },
    createdAt: { type: DataTypes.DATE, allowNull: true },
    updatedAt: { type: DataTypes.DATE, allowNull: true },
  },
  {
    sequelize,
    tableName: 'pedidos_compra_itens',
    timestamps: true,
  }
);

export default PedidoCompraItem;
