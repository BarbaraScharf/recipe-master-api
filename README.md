# RecipeMaster API

Back-end da aplicação **RecipeMaster**, uma plataforma para descobrir, compartilhar e favoritar receitas. Desenvolvido como atividade prática da disciplina de Programação Web, seguindo arquitetura em camadas (Route → Controller → Service) com persistência real em MySQL.

Front-end correspondente: [recipe-master-frontend](https://github.com/BarbaraScharf/recipe-master-frontend)

## Tecnologias

- **Node.js** + **Express** — servidor e rotas da API
- **Sequelize** + **MySQL** — ORM e banco de dados relacional
- **JWT (jsonwebtoken)** — autenticação baseada em token
- **bcryptjs** — hashing de senhas
- **Multer** — upload de arquivos (foto de perfil)
- **express-validator** — validação declarativa de entrada
- **CORS** + **dotenv** + **morgan** — configuração de origem, variáveis de ambiente e logging

## Estrutura do projeto

    recipe-master-api/
    ├── bin/                  # ponto de entrada do servidor (www)
    ├── config/               # database.js, jwt.js, constants.js
    ├── middlewares/          # apiResponse, asyncHandler, errorHandler, auth, profileMulter
    ├── modules/
    │   ├── search/           # busca global (Route → Controller → Service)
    │   └── user/             # cadastro, login, perfil e upload de foto
    ├── public/
    │   └── uploads/
    │       └── profiles/     # fotos de perfil dos usuários
    ├── routes/               # rota raiz (GET /api)
    ├── app.js
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
# Crie um arquivo .env na raiz com o conteúdo abaixo:
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
# 5. Rode em modo desenvolvimento
npm run dev
```

A API sobe em `http://localhost:3000` e sincroniza as tabelas automaticamente via `sequelize.sync({ alter: true })`.

## Endpoints

| Método | Rota                     | Descrição                                    | Auth |
|--------|--------------------------|----------------------------------------------|------|
| GET    | `/api`                   | Status da API                                | Não  |
| GET    | `/api/search?q=`         | Busca global (receitas e usuários)           | Não  |
| POST   | `/api/register`          | Cria uma nova conta                          | Não  |
| POST   | `/api/login`             | Autentica e retorna token JWT                | Não  |
| POST   | `/api/logout`            | Encerra a sessão                             | Sim  |
| GET    | `/api/profile/me`        | Perfil do usuário autenticado                | Sim  |
| PUT    | `/api/profile/me`        | Atualiza nome, bio e foto de perfil          | Sim  |
| GET    | `/api/profile/:username` | Perfil público de um usuário                 | Não  |
| GET    | `/uploads/profiles/:file`| Serve arquivos de foto de perfil             | Não  |

Todas as respostas seguem o padrão:

```json
{ "success": true,  "message": "...", "data": { ... } }
{ "success": false, "message": "...", "errors": [ ... ] }
```

## Autenticação

JWT gerado no login, enviado no header `Authorization: Bearer <token>` nas rotas protegidas. Token expira em 7 dias por padrão.

## Licença

Projeto acadêmico, sem fins comerciais.
