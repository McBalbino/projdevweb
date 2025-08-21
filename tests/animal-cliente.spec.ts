const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../src/index').default; // export default app em src/index.ts
const { expect } = chai;

chai.use(chaiHttp);

function uniqEmail(prefix = 'client') {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random()*1e6)}@test.com`;
}

async function registerAndLoginClient() {
  const email = uniqEmail();
  const senha = 'cli123';
  const reg = await chai.request(app).post('/auth/registrar-cliente').send({
    nome: 'Cliente Animal',
    email,
    senha,
    telefone: '8399-9999'
  });
  const login = await chai.request(app).post('/auth/login').send({ email, senha });
  return { token: login.body.token, clienteId: reg.body.id };
}

describe('Animal como cliente', () => {
  it('deve permitir que o cliente crie um animal', (done) => {
    registerAndLoginClient().then(({ token, clienteId }) => {
      chai.request(app).post('/animais')
        .set('Authorization', `Bearer ${token}`)
        .send({ nome: 'Rex', especie: 'Cão', clienteId })
        .end((err, res) => {
          if (err) return done(err);
          expect(res).to.have.status(201);
          expect(res.body).to.have.property('id');
          expect(res.body).to.have.property('nome', 'Rex');
          expect(res.body).to.have.property('clienteId', clienteId);
          done();
        });
    }).catch(done);
  });
});