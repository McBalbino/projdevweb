import sequelize from '../src/config/database';
import app from '../src/index';

before(async () => {
  await sequelize.sync({ force: true });
});

after(async () => {
  await sequelize.close();
});
