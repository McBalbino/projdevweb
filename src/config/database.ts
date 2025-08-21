import { Sequelize } from 'sequelize'
import * as dotenv from 'dotenv'

dotenv.config();

const DIALECT = (process.env.DB_DIALECT || 'postgres') as any;

let sequelize: Sequelize;

if (DIALECT === 'sqlite') {
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: process.env.DB_STORAGE || ':memory:',
    logging: false,
  });
} else {
  sequelize = new Sequelize({
    dialect: DIALECT,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    logging: false,
  });
}

export default sequelize;
