// src/models/Admin.ts
import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';

interface AdminAttributes {
  id: number;
  nome: string;
  email: string;
  senha: string;
}

export interface AdminCreationAttributes extends Optional<AdminAttributes, 'id'> {}

export class Admin extends Model<AdminAttributes, AdminCreationAttributes> implements AdminAttributes {
  public id!: number;
  public nome!: string;
  public email!: string;
  public senha!: string;
}

Admin.init(
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
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    senha: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'admins',
    timestamps: false,
  }
);
