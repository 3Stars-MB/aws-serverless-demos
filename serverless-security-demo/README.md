# Serverless Security Demo

Sistema serverless seguro para mensagens criptografadas com AWS Lambda, DynamoDB e KMS.

## 🏗️ Arquitetura SOLID

```
src/
├── handlers/        # Lambda functions
├── domain/          # Entities & interfaces
├── usecases/        # Business logic
├── infra/           # AWS implementations
├── utils/           # Validation & errors
└── config/          # Dependency injection
```

## 🔐 Recursos de Segurança

- **Criptografia**: AWS KMS para encrypt/decrypt
- **IAM**: Políticas de menor privilégio
- **Validação**: Schema validation com Zod
- **Controle de acesso**: Usuários só acessam suas mensagens

## 🚀 Deploy

```bash
npm install
npm run deploy
```

## 📡 Endpoints

### POST /messages
```bash
curl -X POST https://api-id.execute-api.us-east-1.amazonaws.com/dev/messages \
  -H "Authorization: AWS4-HMAC-SHA256 ..." \
  -H "Content-Type: application/json" \
  -d '{"content": "Mensagem secreta"}'
```

### GET /messages/{id}
```bash
curl https://api-id.execute-api.us-east-1.amazonaws.com/dev/messages/uuid \
  -H "Authorization: AWS4-HMAC-SHA256 ..."
```

### GET /messages
```bash
curl https://api-id.execute-api.us-east-1.amazonaws.com/dev/messages \
  -H "Authorization: AWS4-HMAC-SHA256 ..."
```

## 🧪 Testes

```bash
npm test
```