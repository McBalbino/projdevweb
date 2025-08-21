import { expect } from 'chai';
import request from 'supertest';
import app from '../src/index';
import { Produto } from '../src/models/Produto';

async function getAdminToken() {
  await request(app).post('/auth/registrar-admin').send({
    nome: 'Admin',
    email: 'adm@pet.com',
    senha: 'admin123'
  });
  const login = await request(app).post('/auth/login').send({ email: 'adm@pet.com', senha: 'admin123' });
  return login.body.token as string;
}

describe('Fornecedor & Pedido de Compra', () => {
  it('should create fornecedor, add product, place and receive an order updating stock', async () => {
    const token = await getAdminToken();

    const f = await request(app).post('/fornecedores')
      .set('Authorization', `Bearer ${token}`)
      .send({ nome: 'ACME Dist', cnpj: '12.345.678/0001-99', email: 'contato@acme.com' });
    expect(f.status).to.equal(201);
    const fornecedorId = f.body.id;

    const pf = await request(app).post(`/fornecedores/${fornecedorId}/produtos`)
      .set('Authorization', `Bearer ${token}`)
      .send({ nome: 'Shampoo 500ml', sku: 'SHAMP-500', preco: 10.5 });
    expect(pf.status).to.equal(201);
    const produtoFornecedorId = pf.body.id;

    const ped = await request(app).post('/pedidos-compra')
      .set('Authorization', `Bearer ${token}`)
      .send({ fornecedorId, itens: [{ produtoFornecedorId, quantidade: 3 }] });
    expect(ped.status).to.equal(201);
    const pedidoId = ped.body.id;

    const rec = await request(app).post(`/pedidos-compra/${pedidoId}/receber`)
      .set('Authorization', `Bearer ${token}`)
      .send();
    expect(rec.status).to.equal(200);
    expect(rec.body.status).to.equal('RECEBIDO');

    const prod = await Produto.findOne({ where: { sku: 'SHAMP-500' } });
    expect(prod).to.not.be.null;
    expect(Number(prod!.estoque)).to.equal(3);
  });
});
