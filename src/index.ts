import express from 'express';
import sequelize from './config/database';
import { AdminController } from './controllers/AdminController';
import { ClientController } from './controllers/ClientController';
import { AnimalController } from './controllers/AnimalController';
import { AuthController } from './controllers/AuthController';
import { autenticarToken, autorizar } from './middlewares/auth';

const app = express();
const port = 3000;

app.use(express.json());

const adminCtrl = new AdminController();
const clientCtrl = new ClientController();
const animalCtrl = new AnimalController();
const authCtrl = new AuthController();

// Rotas públicas
app.post('/login', authCtrl.login);
app.post('/registrar/admin', authCtrl.registrarAdmin);
app.post('/registrar/cliente', authCtrl.registrarCliente);

// Rotas protegidas - apenas admins podem acessar os dados de admins
app.post('/admin', autenticarToken, autorizar(['admin']), adminCtrl.create);
app.get('/admin', autenticarToken, autorizar(['admin']), adminCtrl.list);

// Clientes - acessível por admins e o próprio cliente
app.post('/clientes', autenticarToken, autorizar(['admin']), clientCtrl.create);
app.get('/clientes', autenticarToken, autorizar(['admin']), clientCtrl.list);
app.get('/clientes/:id', autenticarToken, autorizar(['admin', 'cliente']), clientCtrl.show);
app.put('/clientes/:id', autenticarToken, autorizar(['admin', 'cliente']), clientCtrl.update);
app.delete('/clientes/:id', autenticarToken, autorizar(['admin']), clientCtrl.delete);

// Animais - acesso por admins e clientes
app.post('/animais', autenticarToken, autorizar(['admin', 'cliente']), animalCtrl.create);
app.get('/animais', autenticarToken, autorizar(['admin', 'cliente']), animalCtrl.list);
app.get('/animais/:id', autenticarToken, autorizar(['admin', 'cliente']), animalCtrl.show);
app.put('/animais/:id', autenticarToken, autorizar(['admin', 'cliente']), animalCtrl.update);
app.delete('/animais/:id', autenticarToken, autorizar(['admin', 'cliente']), animalCtrl.delete);



sequelize.sync().then(() => {
  app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
  });
});