// src/models/Client.ts
import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';

interface ClientAttributes {
  id: number;
  nome: string;
  telefone: string;
  email: string;
}

export interface ClientCreationAttributes extends Optional<ClientAttributes, 'id'> {}

export class Client extends Model<ClientAttributes, ClientCreationAttributes> implements ClientAttributes {
  public id!: number;
  public nome!: string;
  public telefone!: string;
  public email!: string;
}

Client.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nome: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    telefone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    sequelize,
    tableName: 'clients',
    timestamps: false,
  }
);
