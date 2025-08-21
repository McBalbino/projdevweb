import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';

export interface ClientAttributes {
  id: number;
  nome: string;
  email: string;
  senha: string;
  telefone: string;
  tipo: string;
}

export interface ClientCreationAttributes extends Optional<ClientAttributes, 'id' | 'telefone' | 'tipo'> {}

export class Client extends Model<ClientAttributes, ClientCreationAttributes> implements ClientAttributes {
  public id!: number;
  public nome!: string;
  public email!: string;
  public senha!: string;
  public telefone!: string;
  public tipo!: string;
}

Client.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    nome: { type: DataTypes.STRING(120), allowNull: false },
    email: { type: DataTypes.STRING(120), allowNull: false, unique: true },
    senha: { type: DataTypes.STRING(200), allowNull: false },
    telefone: { type: DataTypes.STRING(30), allowNull: false, defaultValue: '' },
    tipo: { type: DataTypes.STRING(20), allowNull: false, defaultValue: 'cliente' },
  },
  {
    sequelize,
    tableName: 'clients',
    timestamps: false,
  }
);

export default Client;
