# Books CRUD API com Cognito

API para gerenciar livros usando Serverless Framework, DynamoDB e autenticação Cognito.

## Instalação

```bash
npm install
```

## Deploy

```bash
npm run deploy
```

## Arquitetura

- **Serverless Framework**: Infraestrutura como código
- **AWS Lambda**: Funções serverless separadas por operação
- **DynamoDB**: Banco NoSQL com PK/SK pattern
- **Cognito**: Autenticação e autorização
- **API Gateway**: REST API com autorização
- **Princípios SOLID**: Arquitetura limpa e modular

## Endpoints

### Autenticação (sem token)
- `POST /auth/signup` - Registrar usuário

### CRUD Livros (requer token)
- `POST /books` - Criar livro
- `GET /books` - Listar todos os livros
- `GET /books/{id}` - Obter livro por ID
- `PUT /books/{id}` - Atualizar livro
- `DELETE /books/{id}` - Deletar livro

## Como usar

### 1. Registrar usuário
```bash
curl -X POST https://your-api-url/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "Password123",
    "name": "João Silva"
  }'
```

### 2. Fazer login (AWS CLI)
```bash
aws cognito-idp admin-initiate-auth \
  --user-pool-id YOUR_USER_POOL_ID \
  --client-id YOUR_CLIENT_ID \
  --auth-flow ADMIN_NO_SRP_AUTH \
  --auth-parameters USERNAME=user@example.com,PASSWORD=Password123
```

### 3. Usar token nas requisições
```bash
# Criar livro
curl -X POST https://your-api-url/books \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ID_TOKEN" \
  -d '{"title": "1984", "author": "George Orwell", "year": 1949}'

# Listar livros
curl https://your-api-url/books \
  -H "Authorization: Bearer YOUR_ID_TOKEN"

# Obter livro
curl https://your-api-url/books/BOOK_ID \
  -H "Authorization: Bearer YOUR_ID_TOKEN"

# Atualizar livro
curl -X PUT https://your-api-url/books/BOOK_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ID_TOKEN" \
  -d '{"title": "Animal Farm", "author": "George Orwell", "year": 1945}'

# Deletar livro
curl -X DELETE https://your-api-url/books/BOOK_ID \
  -H "Authorization: Bearer YOUR_ID_TOKEN"
```

## Estrutura do Projeto

```
├── functions/           # Handlers Lambda separados
│   ├── signUp.js       # Registro de usuários
│   ├── createBook.js   # Criar livro
│   ├── getBooks.js     # Listar livros
│   ├── getBook.js      # Obter livro
│   ├── updateBook.js   # Atualizar livro
│   └── deleteBook.js   # Deletar livro
├── src/
│   ├── models/         # Entidades de domínio
│   ├── repositories/   # Acesso a dados
│   ├── services/       # Lógica de negócio
│   ├── controllers/    # Controle HTTP
│   └── utils/          # Utilitários
├── serverless.yml      # Configuração infraestrutura
└── package.json        # Dependências
```

## Recursos AWS Criados

- **DynamoDB Table**: `books-crud-api-books-{stage}`
- **Cognito User Pool**: `books-crud-api-user-pool-{stage}`
- **Lambda Functions**: 6 funções (1 auth + 5 CRUD)
- **API Gateway**: REST API com autorização
- **IAM Roles**: Permissões mínimas necessárias

## Padrão DynamoDB

```
PK: BOOK#uuid
SK: METADATA
entityType: Book
```

## Segurança

- ✅ Autenticação obrigatória (exceto signup)
- ✅ Tokens JWT do Cognito
- ✅ CORS habilitado
- ✅ Permissões IAM mínimas
- ✅ Validação de entrada