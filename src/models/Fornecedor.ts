import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';

export interface FornecedorAttributes {
  id: number;
  nome: string;
  cnpj: string;
  email?: string | null;
  telefone?: string | null;
  endereco?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface FornecedorCreationAttributes extends Optional<FornecedorAttributes, 'id'> {}

export class Fornecedor extends Model<FornecedorAttributes, FornecedorCreationAttributes> implements FornecedorAttributes {
  public id!: number;
  public nome!: string;
  public cnpj!: string;
  public email!: string | null;
  public telefone!: string | null;
  public endereco!: string | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Fornecedor.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    nome: { type: DataTypes.STRING(120), allowNull: false },
    cnpj: { type: DataTypes.STRING(18), allowNull: false, unique: true },
    email: { type: DataTypes.STRING(120), allowNull: true },
    telefone: { type: DataTypes.STRING(30), allowNull: true },
    endereco: { type: DataTypes.STRING(255), allowNull: true },
    createdAt: { type: DataTypes.DATE, allowNull: true },
    updatedAt: { type: DataTypes.DATE, allowNull: true },
  },
  {
    sequelize,
    tableName: 'fornecedores',
    timestamps: true,
  }
);

export default Fornecedor;
