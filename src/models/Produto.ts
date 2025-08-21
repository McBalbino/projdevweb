import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';

export interface ProdutoAttributes {
  id: number;
  nome: string;
  sku: string;
  preco: number;
  estoque: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ProdutoCreationAttributes extends Optional<ProdutoAttributes, 'id' | 'estoque'> {}

export class Produto extends Model<ProdutoAttributes, ProdutoCreationAttributes> implements ProdutoAttributes {
  public id!: number;
  public nome!: string;
  public sku!: string;
  public preco!: number;
  public estoque!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Produto.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    nome: { type: DataTypes.STRING(120), allowNull: false },
    sku: { type: DataTypes.STRING(60), allowNull: false, unique: true },
    preco: { type: DataTypes.DECIMAL(10,2), allowNull: false },
    estoque: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    createdAt: { type: DataTypes.DATE, allowNull: true },
    updatedAt: { type: DataTypes.DATE, allowNull: true },
  },
  {
    sequelize,
    tableName: 'produtos',
    timestamps: true,
  }
);

export default Produto;
