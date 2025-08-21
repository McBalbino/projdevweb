import './setup';
import { expect } from 'chai';
import { Admin } from '../src/models/Admin';

describe('Model: Admin', () => {
  it('1) deve criar um admin com sucesso', async () => {
    const admin = await Admin.create({
      nome: 'Admin 1',
      email: 'admin1@example.com',
      senha: 'hash-aqui',
    });
    expect(admin.id).to.be.a('number');
    expect(admin.email).to.equal('admin1@example.com');
  });

  it('2) deve respeitar unique de email (não pode duplicar)', async () => {
    await Admin.create({ nome: 'A', email: 'dup@example.com', senha: 'x' });
    let erro: any;
    try {
      await Admin.create({ nome: 'B', email: 'dup@example.com', senha: 'y' });
    } catch (e) {
      erro = e;
    }
    expect(erro).to.exist;
    expect(String(erro)).to.match(/unique/i);
  });

  it('3) deve buscar admin por ID (findByPk)', async () => {
    const created = await Admin.create({ nome: 'Look', email: 'look@example.com', senha: 'x' });
    const found = await Admin.findByPk(created.id);
    expect(found?.nome).to.equal('Look');
  });

  it('4) deve atualizar o nome de um admin', async () => {
    const a = await Admin.create({ nome: 'Old', email: 'old@example.com', senha: 'x' });
    await a.update({ nome: 'New' });
    const again = await Admin.findByPk(a.id);
    expect(again?.nome).to.equal('New');
  });

  it('5) deve deletar um admin', async () => {
    const a = await Admin.create({ nome: 'Del', email: 'del@example.com', senha: 'x' });
    await Admin.destroy({ where: { id: a.id } });
    const gone = await Admin.findByPk(a.id);
    expect(gone).to.be.null;
  });
});
