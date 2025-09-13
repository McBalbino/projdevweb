
import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

export type ConsultaStatus = 'AGENDADA'|'CONCLUIDA'|'CANCELADA';

interface ConsultaAttrs {
  id: number;
  clienteId: number;
  animalId: number;
  tipo: string;
  data: Date;
  observacoes?: string;
  status: ConsultaStatus;
}

type ConsultaCreation = Optional<ConsultaAttrs, 'id' | 'status' >;

export class Consulta extends Model<ConsultaAttrs, ConsultaCreation> implements ConsultaAttrs {
  public id!: number;
  public clienteId!: number;
  public animalId!: number;
  public tipo!: string;
  public data!: Date;
  public observacoes?: string | undefined;
  public status!: ConsultaStatus;
}

Consulta.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  clienteId: { type: DataTypes.INTEGER, allowNull: false },
  animalId: { type: DataTypes.INTEGER, allowNull: false },
  tipo: { type: DataTypes.STRING, allowNull: false },
  data: { type: DataTypes.DATE, allowNull: false },
  observacoes: { type: DataTypes.TEXT, allowNull: true },
  status: { type: DataTypes.ENUM('AGENDADA','CONCLUIDA','CANCELADA'), allowNull: false, defaultValue: 'AGENDADA' }
}, {
  sequelize,
  tableName: 'consultas',
  timestamps: true
});
