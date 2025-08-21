import { Model, DataTypes, Optional, ForeignKey } from 'sequelize';
import sequelize from '../config/database';
import { Fornecedor } from './Fornecedor';

export interface ProdutoFornecedorAttributes {
  id: number;
  fornecedorId: number;
  nome: string;
  sku: string;
  preco: number;
  ativo: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ProdutoFornecedorCreationAttributes extends Optional<ProdutoFornecedorAttributes, 'id' | 'ativo'> {}

export class ProdutoFornecedor extends Model<ProdutoFornecedorAttributes, ProdutoFornecedorCreationAttributes>
  implements ProdutoFornecedorAttributes {
  public id!: number;
  public fornecedorId!: ForeignKey<Fornecedor['id']>;
  public nome!: string;
  public sku!: string;
  public preco!: number;
  public ativo!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

ProdutoFornecedor.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    fornecedorId: { type: DataTypes.INTEGER, allowNull: false },
    nome: { type: DataTypes.STRING(120), allowNull: false },
    sku: { type: DataTypes.STRING(60), allowNull: false },
    preco: { type: DataTypes.DECIMAL(10,2), allowNull: false },
    ativo: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    createdAt: { type: DataTypes.DATE, allowNull: true },
    updatedAt: { type: DataTypes.DATE, allowNull: true },
  },
  {
    sequelize,
    tableName: 'produtos_fornecedor',
    indexes: [{ unique: true, fields: ['fornecedorId','sku'] }],
    timestamps: true,
  }
);

export default ProdutoFornecedor;
