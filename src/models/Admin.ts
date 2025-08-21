import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';

export interface AdminAttributes {
  id: number;
  nome: string;
  email: string;
  senha: string;
  tipo: string;
}

export interface AdminCreationAttributes extends Optional<AdminAttributes, 'id' | 'tipo'> {}

export class Admin extends Model<AdminAttributes, AdminCreationAttributes> implements AdminAttributes {
  public id!: number;
  public nome!: string;
  public email!: string;
  public senha!: string;
  public tipo!: string;
}

Admin.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    nome: { type: DataTypes.STRING(120), allowNull: false },
    email: { type: DataTypes.STRING(120), allowNull: false, unique: true },
    senha: { type: DataTypes.STRING(200), allowNull: false },
    tipo: { type: DataTypes.STRING(20), allowNull: false, defaultValue: 'admin' },
  },
  {
    sequelize,
    tableName: 'admins',
    timestamps: false,
  }
);

export default Admin;
