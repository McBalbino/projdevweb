import { expect } from 'chai';
import request from 'supertest';
import app from '../src/index';

describe('Auth', () => {
  it('should register an admin and login', async () => {
    const reg = await request(app).post('/auth/registrar-admin').send({
      nome: 'Admin One',
      email: 'admin@example.com',
      senha: 'secret123'
    });
    expect(reg.status).to.equal(201);
    expect(reg.body.email).to.equal('admin@example.com');

    const login = await request(app).post('/auth/login').send({
      email: 'admin@example.com',
      senha: 'secret123'
    });
    expect(login.status).to.equal(200);
    expect(login.body).to.have.property('token');
  });

  it('should register a client', async () => {
    const res = await request(app).post('/auth/registrar-cliente').send({
      nome: 'Maria',
      email: 'maria@cliente.com',
      senha: '123456',
      telefone: '83999999999'
    });
    expect(res.status).to.equal(201);
    expect(res.body.email).to.equal('maria@cliente.com');
  });
});
