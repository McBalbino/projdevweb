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

app.post('/admin', adminCtrl.create); // Criar admin
app.get('/admin', adminCtrl.list);    // Listar todos os admins

app.post('/clientes', clientCtrl.create);       // Criar cliente
app.get('/clientes', clientCtrl.list);          // Listar todos os clientes
app.get('/clientes/:id', clientCtrl.show);      // Obter um cliente específico
app.put('/clientes/:id', clientCtrl.update);    // Atualizar cliente
app.delete('/clientes/:id', clientCtrl.delete); // Remover cliente

app.post('/animais', animalCtrl.create);       // Criar animal
app.get('/animais', animalCtrl.list);          // Listar todos os animais
app.get('/animais/:id', animalCtrl.show);      // Obter um animal específico
app.put('/animais/:id', animalCtrl.update);    // Atualizar animal
app.delete('/animais/:id', animalCtrl.delete); // Remover animal


sequelize.sync().then(() => {
  app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
  });
});