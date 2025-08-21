import './setup';
import { expect } from 'chai';
import { Client } from '../src/models/Client';

describe('Model: Client', () => {
  it('1) deve criar cliente com sucesso', async () => {
    const c = await Client.create({
      nome: 'Cliente 1',
      telefone: '11999999999',
      email: 'c1@example.com',
      senha: 'hash-aqui', 
    });
    expect(c.id).to.be.a('number');
    expect(c.email).to.equal('c1@example.com');
  });

  it('2) deve rejeitar duplicidade de email', async () => {
    await Client.create({ nome: 'C', telefone: '11', email: 'dup@c.com', senha: 'x' });
    let erro: any;
    try {
      await Client.create({ nome: 'C2', telefone: '22', email: 'dup@c.com', senha: 'y' });
    } catch (e) {
      erro = e;
    }
    expect(erro).to.exist;
    expect(String(erro)).to.match(/unique/i);
  });

  it('3) deve atualizar telefone do cliente', async () => {
    const c = await Client.create({ nome: 'Tel', telefone: '11', email: 't@c.com', senha: 'x' });
    await c.update({ telefone: '22' });
    const again = await Client.findByPk(c.id);
    expect(again?.telefone).to.equal('22');
  });

  it('4) deve retornar lista (findAll) com ao menos 1 cliente', async () => {
    await Client.create({ nome: 'L', telefone: '33', email: 'l@c.com', senha: 'x' });
    const all = await Client.findAll();
    expect(all.length).to.be.greaterThan(0);
  });

  it('5) deve deletar cliente', async () => {
    const c = await Client.create({ nome: 'Del', telefone: '44', email: 'del@c.com', senha: 'x' });
    await Client.destroy({ where: { id: c.id } });
    const gone = await Client.findByPk(c.id);
    expect(gone).to.be.null;
  });
});
