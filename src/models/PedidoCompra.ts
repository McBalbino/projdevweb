import { Model, DataTypes, Optional, ForeignKey } from 'sequelize';
import sequelize from '../config/database';
import { Fornecedor } from './Fornecedor';
import { Admin } from './Admin';

export type StatusPedido = 'ABERTO' | 'APROVADO' | 'ENVIADO' | 'RECEBIDO' | 'CANCELADO';

export interface PedidoCompraAttributes {
  id: number;
  fornecedorId: number;
  adminId: number;
  status: StatusPedido;
  total: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface PedidoCompraCreationAttributes extends Optional<PedidoCompraAttributes, 'id' | 'status' | 'total'> {}

export class PedidoCompra extends Model<PedidoCompraAttributes, PedidoCompraCreationAttributes>
  implements PedidoCompraAttributes {
  public id!: number;
  public fornecedorId!: ForeignKey<Fornecedor['id']>;
  public adminId!: ForeignKey<Admin['id']>;
  public status!: StatusPedido;
  public total!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

PedidoCompra.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    fornecedorId: { type: DataTypes.INTEGER, allowNull: false },
    adminId: { type: DataTypes.INTEGER, allowNull: false },
    status: { type: DataTypes.ENUM('ABERTO','APROVADO','ENVIADO','RECEBIDO','CANCELADO'), allowNull: false, defaultValue: 'ABERTO' },
    total: { type: DataTypes.DECIMAL(12,2), allowNull: false, defaultValue: 0 },
    createdAt: { type: DataTypes.DATE, allowNull: true },
    updatedAt: { type: DataTypes.DATE, allowNull: true },
  },
  {
    sequelize,
    tableName: 'pedidos_compra',
    timestamps: true,
  }
);

export default PedidoCompra;
