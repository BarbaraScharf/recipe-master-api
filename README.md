# RecipeMaster API

Back-end da aplicação **RecipeMaster**, uma plataforma para descobrir, compartilhar e favoritar receitas. Este projeto foi desenvolvido como atividade prática da disciplina de Programação Web, seguindo uma arquitetura em camadas (Route → Controller → Service) e persistência de dados real com MySQL.

Front-end correspondente: [recipe-master-frontend](https://github.com/BarbaraScharf/recipe-master-frontend)

## Tecnologias

- **Node.js** + **Express** — servidor e rotas da API
- **Sequelize** + **MySQL** — ORM e banco de dados relacional
- **JWT (jsonwebtoken)** — autenticação baseada em token
- **bcryptjs** — hashing de senhas
- **express-validator** — validação declarativa de entrada
- **CORS** + **dotenv** + **morgan** — configuração de origem, variáveis de ambiente e logging

## Estrutura do projeto

    recipe-master-api/
    ├── bin/                  # ponto de entrada do servidor (www)
    ├── config/               # configuração de banco, JWT e constantes
    ├── middlewares/          # apiResponse, asyncHandler, errorHandler, auth
    ├── modules/
    │   ├── search/           # busca global (Route → Controller → Service)
    │   └── user/             # cadastro, login e perfil de usuário
    ├── routes/               # rota raiz (GET /api)
    ├── app.js                # configuração principal da aplicação Express
    └── package.json

## Como rodar o projeto

### Pré-requisitos
- Node.js 18+ e npm
- MySQL instalado e rodando localmente

### Passo a passo

```bash
# 1. Clone o repositório
git clone https://github.com/BarbaraScharf/recipe-master-api.git
cd recipe-master-api

# 2. Instale as dependências
npm install

# 3. Crie o banco de dados no MySQL
CREATE DATABASE recipe_master_db;

# 4. Configure as variáveis de ambiente
# Crie um arquivo .env na raiz do projeto com o seguinte conteúdo:
```

```env
PORT=3000
CORS_ORIGIN=http://localhost:5173
DB_HOST=localhost
DB_PORT=3306
DB_NAME=recipe_master_db
DB_USER=root
DB_PASSWORD=sua_senha_aqui
JWT_SECRET=uma_string_secreta_aleatoria
JWT_EXPIRES_IN=7d
```

```bash
# 5. Rode o servidor em modo desenvolvimento
npm run dev
```

A API sobe em `http://localhost:3000` e sincroniza automaticamente as tabelas no banco (`sequelize.sync`).

## Endpoints principais

| Método | Rota                    | Descrição                                  | Autenticação |
|--------|-------------------------|---------------------------------------------|--------------|
| GET    | `/api`                  | Status da API                               | Não          |
| GET    | `/api/search?q=`        | Busca global (receitas e usuários)          | Não          |
| POST   | `/api/register`         | Cria uma nova conta                         | Não          |
| POST   | `/api/login`             | Autentica e retorna um token JWT            | Não          |
| POST   | `/api/logout`            | Encerra a sessão                            | Sim          |
| GET    | `/api/profile/me`        | Retorna o perfil do usuário autenticado     | Sim          |
| GET    | `/api/profile/:username` | Retorna o perfil público de um usuário      | Não          |

Todas as respostas seguem o padrão:

```json
// sucesso
{ "success": true, "message": "...", "data": { ... } }

// erro
{ "success": false, "message": "...", "errors": [ ... ] }
```

## Autenticação

A API utiliza **JWT**: o token é gerado no login e deve ser enviado no header `Authorization: Bearer <token>` nas rotas protegidas.

## Licença

Projeto acadêmico, sem fins comerciais.
