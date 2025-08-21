import './setup';
import { expect } from 'chai';
import { Fornecedor } from '../src/models/Fornecedor';

describe('Model: Fornecedor', () => {
  it('1) deve criar fornecedor', async () => {
    const f = await Fornecedor.create({
      nome: 'Fornecedor X',
      email: 'contato@forx.com',
      telefone: '1133334444',
      cnpj: '12.345.678/0001-90',
    });
    expect(f.id).to.be.a('number');
    expect(f.cnpj).to.equal('12.345.678/0001-90');
  });

  it('2) deve falhar em CNPJ duplicado', async () => {
    await Fornecedor.create({
      nome: 'F1',
      email: 'f1@x.com',
      telefone: '1100000000',
      cnpj: '99.999.999/0001-99',
    });
    let erro: any;
    try {
      await Fornecedor.create({
        nome: 'F2',
        email: 'f2@x.com',
        telefone: '1100000001',
        cnpj: '99.999.999/0001-99',
      });
    } catch (e) {
      erro = e;
    }
    expect(erro).to.exist;
    expect(String(erro)).to.match(/unique/i);
  });

  it('3) deve atualizar telefone do fornecedor', async () => {
    const f = await Fornecedor.create({
      nome: 'F3',
      email: 'f3@x.com',
      telefone: '1111111111',
      cnpj: '11.111.111/0001-11',
    });
    await f.update({ telefone: '1199999999' });
    const again = await Fornecedor.findByPk(f.id);
    expect(again?.telefone).to.equal('1199999999');
  });

  it('4) buscar fornecedor inexistente retorna null', async () => {
    const notFound = await Fornecedor.findByPk(99999);
    expect(notFound).to.be.null;
  });

  it('5) deve deletar fornecedor', async () => {
    const f = await Fornecedor.create({
      nome: 'F4',
      email: 'f4@x.com',
      telefone: '1222222222',
      cnpj: '22.222.222/0001-22',
    });
    await Fornecedor.destroy({ where: { id: f.id } });
    const gone = await Fornecedor.findByPk(f.id);
    expect(gone).to.be.null;
  });
});
