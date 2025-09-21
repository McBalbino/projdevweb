import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';
import { Client } from './Client';

export interface AnimalAttributes {
  id: number;
  nome: string;
  especie: string;
  raca: string;
  idade: number | null;
  clienteId: number;
}

export interface AnimalCreationAttributes extends Optional<AnimalAttributes, 'id' | 'idade'> {}

export class Animal extends Model<AnimalAttributes, AnimalCreationAttributes> implements AnimalAttributes {
  public id!: number;
  public nome!: string;
  public especie!: string;
  public raca!: string;
  public idade!: number | null;
  public clienteId!: number;
}

Animal.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    nome: { type: DataTypes.STRING(120), allowNull: false },
    especie: { type: DataTypes.STRING(60), allowNull: false },
    raca: { type: DataTypes.STRING(120), allowNull: false },
    idade: { type: DataTypes.INTEGER, allowNull: true },
    clienteId: { type: DataTypes.INTEGER, allowNull: false },
  },
  {
    sequelize,
    tableName: 'animals',
    timestamps: false,
  }
);

export default Animal;
