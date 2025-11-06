# AWS Serverless Training Projects

Coleção de projetos demonstrando melhores práticas para desenvolvimento serverless na AWS.

## Projetos Incluídos

### 🔐 [serverless-security-demo](./serverless-security-demo/)
Demonstra práticas de segurança em aplicações serverless com:
- Criptografia usando AWS KMS
- Gerenciamento de secrets com AWS Secrets Manager
- Validação de entrada e sanitização
- Arquitetura SOLID com DDD

**Tecnologias:** TypeScript, Lambda, KMS, Secrets Manager, DynamoDB

### 📊 [dynamodb-demo](./dynamodb-demo/)
Exemplos de padrões de acesso e modelagem de dados no DynamoDB:
- Single Table Design
- GSI (Global Secondary Index)
- Queries eficientes
- Arquitetura SOLID

**Tecnologias:** Node.js, DynamoDB, Lambda

### 🚀 [api-gateway-demo](./api-gateway-demo/)
API REST completa com autenticação e CRUD:
- AWS Cognito para autenticação
- API Gateway com autorização
- Operações CRUD em DynamoDB
- Validação de dados

**Tecnologias:** Node.js, API Gateway, Cognito, DynamoDB

### ⚡ [lambda-best-practices-demo](./lambda-best-practices-demo/)
Demonstra melhores práticas para funções Lambda:
- Processamento de eventos S3
- Notificações via SNS
- Tratamento de erros
- Logging estruturado

**Tecnologias:** Node.js, Lambda, S3, SNS

### 📈 [monitoring-and-observability-demo](./monitoring-and-observability-demo/)
Implementa observabilidade completa:
- AWS X-Ray para tracing
- CloudWatch Logs e Metrics
- Dashboards personalizados
- Alertas automatizados

**Tecnologias:** TypeScript, X-Ray, CloudWatch, Lambda

## Estrutura dos Projetos

### serverless-security-demo
```
src/
├── domain/
│   ├── entities/
│   │   └── Message.ts
│   └── interfaces/
│       ├── IEncryptionService.ts
│       └── IMessageRepository.ts
├── usecases/
│   ├── __tests__/
│   └── MessageUseCase.ts
├── infra/
│   ├── gateways/
│   │   └── KMSEncryptionService.ts
│   └── repositories/
│       └── DynamoMessageRepository.ts
├── handlers/
│   └── messageHandler.ts
├── config/
│   └── container.ts
└── utils/
    ├── errors.ts
    ├── logger.ts
    └── validation.ts
```

### dynamodb-demo
```
src/
├── config/
│   └── database.js
├── models/
│   └── Product.js
├── repositories/
│   ├── IProductRepository.js
│   └── DynamoProductRepository.js
├── services/
│   └── ProductService.js
├── controllers/
│   └── ProductController.js
├── handlers/
│   ├── getProduct.js
│   └── listProducts.js
└── utils/
    └── ResponseHelper.js
```

### api-gateway-demo
```
functions/
├── createBook.js
├── deleteBook.js
├── getBook.js
├── getBooks.js
├── signUp.js
└── updateBook.js
src/
├── controllers/
│   └── BookController.js
├── models/
│   └── Book.js
├── repositories/
│   └── BookRepository.js
├── services/
│   └── BookService.js
└── utils/
    └── httpResponse.js
```

### lambda-best-practices-demo
```
src/
└── index.js
```

### monitoring-and-observability-demo
```
src/
├── handler.ts
└── types.ts
scripts/
├── test-api.sh
└── test-api.bat
examples/
├── test-payload.json
└── test-requests.http
docs/
└── SETUP-CONTA-AWS.md
```

## Configuração Geral

### Pré-requisitos
- Node.js 18+ ou 20+
- AWS CLI configurado
- Serverless Framework
- Conta AWS com permissões adequadas

### Setup Rápido
```bash
# Clonar repositório
git clone <repository-url>
cd training

# Escolher projeto
cd <project-name>

# Instalar dependências
npm install

# Configurar ambiente
cp env.example .env
# Editar .env com suas configurações

# Deploy
npx sls deploy
```

## Padrões Utilizados

### Segurança
- Criptografia de dados sensíveis
- Validação rigorosa de entrada
- Princípio do menor privilégio (IAM)
- Secrets management adequado

### Observabilidade
- Logging estruturado
- Tracing distribuído
- Métricas customizadas
- Dashboards e alertas

### Arquitetura
- Clean Architecture (projetos SOLID)
- Dependency Injection
- Separation of Concerns
- Testabilidade

## Recursos de Aprendizado

Cada projeto inclui:
- README específico com instruções de teste
- Exemplos de uso
- Configurações de exemplo
- Documentação de arquitetura

## Contribuição

1. Fork o repositório
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Abra um Pull Request

## Licença

MIT License - veja [LICENSE](LICENSE) para detalhes.