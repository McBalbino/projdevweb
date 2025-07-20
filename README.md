
# Sistema de Petshop para disciplina DevWeb

## Descrição
Sistema backend para gerenciamento de Petshop, com cadastro e gerenciamento de Clientes, Animais e Veterinários usando Node.js, TypeScript, Express e Sequelize (Postgres).

## Pré-requisitos
- Node.js (versão >= 16)
- PostgreSQL instalado e rodando
- npm ou yarn

## Configuração do Banco de Dados
1. Crie um banco de dados PostgreSQL chamado `petshop`.
2. Configure seu usuário, senha e porta conforme seu ambiente.

## Configuração do Projeto

1. Clone o repositório:

```bash
git clone https://github.com/McBalbino/projdevweb.git
cd projdevweb
```

2. Instale as dependências:

```bash
npm install
```

3. Configure o arquivo `.env` na raiz com as variáveis:

```
DB_DIALECT=postgres
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=sua_senha_aqui
DB_NAME=petshop
```

Substitua `sua_senha_aqui` pela senha do seu usuário PostgreSQL.

## Rodando a aplicação

```bash
npm run dev
```

A aplicação estará disponível em: `http://localhost:3000`

## Endpoints disponíveis

### Admin
- `POST /admin` — Criar admin
- `GET /admin` — Listar admins

### Clientes
- `POST /clientes` — Criar cliente
- `GET /clientes` — Listar clientes
- `GET /clientes/:id` — Detalhar cliente
- `PUT /clientes/:id` — Atualizar cliente
- `DELETE /clientes/:id` — Remover cliente

### Animais
- `POST /animais` — Criar animal
- `GET /animais` — Listar animais
- `GET /animais/:id` — Detalhar animal
- `PUT /animais/:id` — Atualizar animal
- `DELETE /animais/:id` — Remover animal

### Veterinários
- `POST /veterinarios` — Criar veterinário
- `GET /veterinarios` — Listar veterinários

---

