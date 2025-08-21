import sequelize from '../src/config/database';

import '../src/models/Admin';
import '../src/models/Client';
import '../src/models/Animal';
import '../src/models/Fornecedor';

before(async () => {
  await sequelize.sync({ force: true });
});

beforeEach(async () => {
  for (const modelName of Object.keys(sequelize.models)) {
    await sequelize.models[modelName].destroy({ where: {}, truncate: true, force: true });
  }
});

after(async () => {
  await sequelize.close();
});
