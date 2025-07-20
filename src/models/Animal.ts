// src/models/Animal.ts
import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';
import { Client } from './Client';

interface AnimalAttributes {
  id: number;
  nome: string;
  especie: string;
  raca: string;
  idade: number;
  clienteId: number;
}

export interface AnimalCreationAttributes extends Optional<AnimalAttributes, 'id'> {}

export class Animal extends Model<AnimalAttributes, AnimalCreationAttributes> implements AnimalAttributes {
  public id!: number;
  public nome!: string;
  public especie!: string;
  public raca!: string;
  public idade!: number;
  public clienteId!: number;
}

Animal.init(
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
    especie: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    raca: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    idade: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    clienteId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Client,
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
  },
  {
    sequelize,
    tableName: 'animals',
    timestamps: false,
  }
);
