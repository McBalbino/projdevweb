import express from 'express';
import sequelize from './config/database';
import { AdminController } from './controllers/AdminController';
import { ClientController } from './controllers/ClientController';
import { AnimalController } from './controllers/AnimalController';

const app = express();
const port = 3000;

app.use(express.json());

const adminCtrl = new AdminController();
const clientCtrl = new ClientController();
const animalCtrl = new AnimalController();

app.post('/admin', adminCtrl.create);
app.get('/admin', adminCtrl.list);

app.post('/clientes', clientCtrl.create);
app.get('/clientes', clientCtrl.list);

app.post('/animais', animalCtrl.create);
app.get('/animais', animalCtrl.list);

sequelize.sync().then(() => {
  app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
  });
});