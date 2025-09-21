import express from 'express';
import sequelize from './config/database';
import './models/associations';

import { AdminController } from './controllers/AdminController';
import { ClientController } from './controllers/ClientController';
import { AnimalController } from './controllers/AnimalController';
import { AuthController } from './controllers/AuthController';
import { FornecedorController } from './controllers/FornecedorController';
import { ProdutoFornecedorController } from './controllers/ProdutoFornecedorController';
import { PedidoCompraController } from './controllers/PedidoCompraController';
import { ConsultaController } from './controllers/ConsultaController';

import { autenticarToken, autorizar } from './middlewares/auth';

const app = express();
const port = 3000;

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', process.env.CORS_ORIGIN || '*');
  res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});

app.use(express.json());

const authCtrl = new AuthController();
const adminCtrl = new AdminController();
const clientCtrl = new ClientController();
const animalCtrl = new AnimalController();
const fornecedorCtrl = new FornecedorController();
const produtoFornecedorCtrl = new ProdutoFornecedorController();
const consultaCtrl = new ConsultaController();
const pedidoCtrl = new PedidoCompraController();

// Auth
app.post('/auth/login', authCtrl.login);
app.post('/auth/registrar-admin', authCtrl.registrarAdmin);
app.post('/auth/registrar-cliente', authCtrl.registrarCliente);

// Admins 
app.post('/admins', autenticarToken, autorizar(['admin']), adminCtrl.create);
app.get('/admins', autenticarToken, autorizar(['admin']), adminCtrl.list);
app.get('/admins/:id', autenticarToken, autorizar(['admin']), adminCtrl.show);
app.put('/admins/:id', autenticarToken, autorizar(['admin']), adminCtrl.update);
app.delete('/admins/:id', autenticarToken, autorizar(['admin']), adminCtrl.delete);

// Clientes
app.post('/clients', autenticarToken, autorizar(['admin']), clientCtrl.create);
app.get('/clients', autenticarToken, autorizar(['admin']), clientCtrl.list);
app.get('/clients/:id', autenticarToken, autorizar(['admin']), clientCtrl.show);
app.put('/clients/:id', autenticarToken, autorizar(['admin']), clientCtrl.update);
app.delete('/clients/:id', autenticarToken, autorizar(['admin']), clientCtrl.delete);

// Animais
app.post('/animais', autenticarToken, autorizar(['admin','cliente']), animalCtrl.create);
app.get('/animais', autenticarToken, autorizar(['admin','cliente']), animalCtrl.list);
app.get('/animais/:id', autenticarToken, autorizar(['admin','cliente']), animalCtrl.show);
app.put('/animais/:id', autenticarToken, autorizar(['admin','cliente']), animalCtrl.update);
app.delete('/animais/:id', autenticarToken, autorizar(['admin','cliente']), animalCtrl.delete);

// Fornecedores
app.post('/fornecedores', autenticarToken, autorizar(['admin']), fornecedorCtrl.create);
app.get('/fornecedores', autenticarToken, autorizar(['admin','cliente']), fornecedorCtrl.list);
app.get('/fornecedores/:id', autenticarToken, autorizar(['admin','cliente']), fornecedorCtrl.show);
app.put('/fornecedores/:id', autenticarToken, autorizar(['admin']), fornecedorCtrl.update);
app.delete('/fornecedores/:id', autenticarToken, autorizar(['admin']), fornecedorCtrl.delete);

// Produtos do fornecedor
app.post('/fornecedores/:id/produtos', autenticarToken, autorizar(['admin']), fornecedorCtrl.addProduto);
app.get('/fornecedores/:id/produtos', autenticarToken, autorizar(['admin','cliente']), fornecedorCtrl.listProdutos);
app.put('/produtos-fornecedor/:id', autenticarToken, autorizar(['admin']), produtoFornecedorCtrl.update);
app.delete('/produtos-fornecedor/:id', autenticarToken, autorizar(['admin']), produtoFornecedorCtrl.disable);

// Pedidos de compra (admin)
app.post('/pedidos-compra', autenticarToken, autorizar(['admin']), pedidoCtrl.create);
app.get('/pedidos-compra', autenticarToken, autorizar(['admin']), pedidoCtrl.list);
app.get('/pedidos-compra/:id', autenticarToken, autorizar(['admin']), pedidoCtrl.show);
app.patch('/pedidos-compra/:id/status', autenticarToken, autorizar(['admin']), pedidoCtrl.status);
app.post('/pedidos-compra/:id/receber', autenticarToken, autorizar(['admin']), pedidoCtrl.receber);


// Consultas
app.post('/consultas', autenticarToken, autorizar(['cliente','admin']), consultaCtrl.create);
app.get('/consultas', autenticarToken, autorizar(['admin']), consultaCtrl.listAll);
app.get('/consultas/minhas', autenticarToken, autorizar(['cliente']), consultaCtrl.listMine);
app.put('/consultas/:id', autenticarToken, autorizar(['cliente','admin']), consultaCtrl.update);
app.delete('/consultas/:id', autenticarToken, autorizar(['cliente','admin']), consultaCtrl.remove);


if (process.env.NODE_ENV !== 'test') {
  sequelize.sync().then(() => {
    app.listen(port, () => {
      console.log(`Servidor rodando em http://localhost:${port}`);
    });
  });
}

export default app;
