import './setup';
import { expect } from 'chai';
import { Animal } from '../src/models/Animal';
import { Client } from '../src/models/Client';

describe('Model: Animal', () => {
  it('1) deve criar animal vinculado a um cliente', async () => {
    const dono = await Client.create({ nome: 'Dono', telefone: '11', email: 'dono@x.com', senha: 'x' });
    const a = await Animal.create({
      nome: 'Rex',
      especie: 'Cachorro',
      clienteId: dono.id,
    });
    expect(a.id).to.be.a('number');
    expect(a.clienteId).to.equal(dono.id);
  });

  it('2) deve falhar ao criar sem campos obrigatórios (nome)', async () => {
    const dono = await Client.create({ nome: 'Dono2', telefone: '22', email: 'd2@x.com', senha: 'x' });
    let erro: any;
    try {
      await Animal.create({
        especie: 'Gato',
        clienteId: dono.id,
      } as any);
    } catch (e) {
      erro = e;
    }
    expect(erro).to.exist;
  });


  it('3) deve listar animais por cliente (findAll com where)', async () => {
    const dono = await Client.create({ nome: 'Dono4', telefone: '44', email: 'd4@x.com', senha: 'x' });
    await Animal.create({ nome: 'A1', especie: 'Ave', clienteId: dono.id });
    await Animal.create({ nome: 'A2', especie: 'Ave', clienteId: dono.id });
    const lista = await Animal.findAll({ where: { clienteId: dono.id } });
    expect(lista.length).to.equal(2);
  });

  it('4) deve deletar animal', async () => {
    const dono = await Client.create({ nome: 'Dono5', telefone: '55', email: 'd5@x.com', senha: 'x' });
    const a = await Animal.create({ nome: 'Bolt', especie: 'Cachorro', clienteId: dono.id });
    await Animal.destroy({ where: { id: a.id } });
    const gone = await Animal.findByPk(a.id);
    expect(gone).to.be.null;
  });
});
