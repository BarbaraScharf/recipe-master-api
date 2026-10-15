# RecipeMaster API

API REST da aplicação **RecipeMaster**, uma plataforma para descobrir, compartilhar e favoritar receitas culinárias. Desenvolvida como atividade prática da disciplina de Programação Web.

Front-end correspondente: [recipe-master-frontend](https://github.com/BarbaraScharf/recipe-master-frontend)

## Tecnologias

- **Node.js** + **Express 5** — framework web
- **Sequelize 6** + **MySQL** — ORM e banco de dados
- **JWT** (`jsonwebtoken`) — autenticação stateless
- **bcryptjs** — hash de senhas
- **Multer** — upload de arquivos
- **express-validator** — validação de entrada

## Estrutura do projeto

```
recipe-master-api/
├── bin/www              # inicialização do servidor
├── config/              # database, jwt, constants, associations
├── middlewares/         # apiResponse, asyncHandler, errorHandler, auth, optionalAuth, multers
├── modules/
│   ├── user/            # cadastro, login, perfil, feed
│   ├── recipe/          # CRUD de receitas, upload de imagem
│   ├── like/            # curtidas com toggle e atualização otimista
│   ├── comment/         # comentários com validação
│   └── search/          # busca global
├── routes/              # rota raiz GET /api
├── public/uploads/      # arquivos enviados (perfis e receitas)
├── app.js
└── package.json
```

## Como rodar o projeto

### Pré-requisitos

- Node.js 18+ e npm
- MySQL rodando com o banco `recipe_master_db` criado

### Passo a passo

```bash
# 1. Clone o repositório
git clone https://github.com/BarbaraScharf/recipe-master-api.git
cd recipe-master-api

# 2. Instale as dependências
npm install

# 3. Configure as variáveis de ambiente
# Crie um arquivo .env na raiz com base no .env.example
```

```env
PORT=3000
CORS_ORIGIN=http://localhost:5173
DB_HOST=localhost
DB_PORT=3306
DB_NAME=recipe_master_db
DB_USER=root
DB_PASSWORD=sua_senha
JWT_SECRET=seu_secret
JWT_EXPIRES_IN=7d
```

```bash
# 4. Rode o servidor de desenvolvimento
npm run dev
```

A API sobe em `http://localhost:3000`. O Sequelize cria/atualiza as tabelas automaticamente.

## Endpoints principais

| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| GET | `/api` | Pública | Status da API |
| POST | `/api/register` | Pública | Cadastro |
| POST | `/api/login` | Pública | Login |
| GET | `/api/profile/me` | Token | Perfil próprio |
| PUT | `/api/profile/me` | Token | Editar perfil + foto |
| GET | `/api/profile/:username` | Opcional | Perfil público |
| GET | `/api/feed` | Token | Feed paginado |
| POST | `/api/recipes` | Token | Criar receita |
| GET | `/api/recipes/:id` | Opcional | Detalhe da receita |
| PUT | `/api/recipes/:id` | Token | Editar receita |
| DELETE | `/api/recipes/:id` | Token | Excluir receita |
| GET | `/api/my-recipes` | Token | Minhas receitas |
| POST | `/api/recipes/:id/toggle-like` | Token | Curtir/descurtir |
| GET | `/api/recipes/:id/like-status` | Opcional | Status da curtida |
| GET | `/api/liked-recipes` | Token | Receitas curtidas |
| POST | `/api/recipes/:id/comments` | Token | Comentar |
| GET | `/api/recipes/:id/comments` | Pública | Listar comentários |
| GET | `/api/search` | Pública | Busca global |

## Licença

Projeto acadêmico, sem fins comerciais.
