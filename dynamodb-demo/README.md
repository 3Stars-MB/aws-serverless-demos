# E-commerce DynamoDB Demo

Aplicação serverless demonstrando conceitos de modelagem NoSQL com Amazon DynamoDB em um contexto de e-commerce, implementada com arquitetura SOLID.

## 🏗️ Arquitetura SOLID

- **Framework**: Serverless Framework v4
- **Runtime**: Node.js 20.x (ESM)
- **Database**: Amazon DynamoDB
- **API**: AWS Lambda + API Gateway HTTP API
- **Padrão**: Arquitetura em camadas seguindo princípios SOLID

### 📁 Estrutura do Projeto
```
src/
├── config/          # Configurações (DatabaseConfig)
├── models/          # Modelos de dados (Product)
├── repositories/    # Acesso a dados (Interface + Implementação)
├── services/        # Lógica de negócio (ProductService)
├── controllers/     # Interface HTTP (ProductController)
├── handlers/        # Handlers Lambda específicos
└── utils/           # Utilitários (ResponseHelper)
```

## 📊 Modelagem DynamoDB

### Tabela: Products

| Atributo | Tipo | Descrição |
|----------|------|-----------|
| PK | String | Partition Key - formato `PRODUCT#<id>` |
| SK | String | Sort Key - formato `METADATA#<id>` |
| Name | String | Nome do produto |
| Category | String | Categoria do produto |
| Price | Number | Preço do produto |
| Stock | Number | Quantidade em estoque |
| Brand | String | Marca do produto |

### Padrão de Chaves

```
PK: PRODUCT#001    SK: METADATA#001    # Produto principal
PK: PRODUCT#001    SK: METADATA#002    # Relacionamento cruzado
PK: PRODUCT#001    SK: SPECS#001       # Especificações técnicas
```

## 🚀 Deploy

### Pré-requisitos

1. AWS CLI configurado
2. Node.js 20+ instalado
3. Serverless Framework instalado globalmente

```bash
npm install -g serverless
```

### Instalação

```bash
# Instalar dependências
npm install

# Deploy da aplicação
npm run deploy

# Inserir dados básicos
chmod +x insert-sample-data.sh
./insert-sample-data.sh

# Inserir dados estendidos (opcional)
chmod +x insert-extended-data.sh
./insert-extended-data.sh
```

## 📡 Endpoints

### GET /products
Lista todos os produtos disponíveis.

**Resposta:**
```json
{
  "products": [
    {
      "id": "001",
      "name": "Mouse Gamer RGB",
      "category": "Peripherals",
      "price": 199.90,
      "stock": 120,
      "brand": "Logitech"
    }
  ],
  "count": 1
}
```

### GET /products/{id}
Retorna um produto específico pelo ID.

**Resposta:**
```json
{
  "product": {
    "id": "001",
    "name": "Mouse Gamer RGB",
    "category": "Peripherals",
    "price": 199.90,
    "stock": 120,
    "brand": "Logitech"
  }
}
```

## 🧠 Conceitos Demonstrados

### 1. **Modelagem NoSQL**
- Uso de chave composta (PK + SK)
- Padrão de nomenclatura hierárquica
- Relacionamentos através de chaves cruzadas

### 2. **Operações DynamoDB**
- **Scan**: Para listar todos os produtos
- **GetItem**: Para buscar produto específico
- **FilterExpression**: Para filtrar resultados

### 3. **Padrões de Acesso**
- Acesso por ID específico (GetItem)
- Listagem completa com filtros (Scan)
- Relacionamentos um-para-muitos

### 4. **Boas Práticas**
- Uso do DynamoDB Document Client
- Tratamento de erros adequado
- Transformação de dados para API
- Permissões IAM mínimas necessárias

### 5. **Princípios SOLID**
- **Single Responsibility**: Cada classe tem uma responsabilidade única
- **Open/Closed**: Aberto para extensão, fechado para modificação
- **Liskov Substitution**: Implementações podem ser substituídas
- **Interface Segregation**: Interfaces específicas e coesas
- **Dependency Inversion**: Dependência de abstrações, não implementações

## 🔧 Comandos Úteis

```bash
# Ver logs das funções
npm run logs listProducts
npm run logs getProduct

# Remover toda a infraestrutura
npm run remove
```

## 📚 Diferenças vs SQL

| Aspecto | SQL (Relacional) | DynamoDB (NoSQL) |
|---------|------------------|------------------|
| Esquema | Fixo, normalizado | Flexível, desnormalizado |
| Chaves | Primary Key simples | Partition Key + Sort Key |
| Consultas | JOIN, WHERE complexo | GetItem, Query, Scan |
| Escalabilidade | Vertical | Horizontal automática |
| Consistência | ACID completo | Eventual/Strong configurável |
| Relacionamentos | Foreign Keys + JOINs | Chaves cruzadas + Desnormalização |