# Setup da Conta AWS

Este documento descreve como configurar sua conta AWS para executar o workshop de monitoramento e observabilidade.

## Pré-requisitos

- Conta AWS ativa
- AWS CLI instalado e configurado
- Node.js 18+ instalado
- Serverless Framework instalado

## Configuração Inicial

### 1. Configurar AWS CLI

```bash
aws configure
```

Forneça:
- AWS Access Key ID
- AWS Secret Access Key
- Default region: `us-east-1`
- Default output format: `json`

### 2. Verificar Permissões

Sua conta AWS precisa das seguintes permissões:

- **Lambda**: Criar e gerenciar funções
- **API Gateway**: Criar APIs REST
- **DynamoDB**: Criar e gerenciar tabelas
- **CloudWatch**: Criar dashboards e métricas
- **X-Ray**: Configurar tracing
- **IAM**: Criar roles para Lambda

### 3. Instalar Dependências

```bash
npm install
```

### 4. Deploy da Aplicação

```bash
npx sls deploy
```

## Recursos Criados

O deploy criará os seguintes recursos:

### Lambda Functions
- `processData`: Processa dados e salva no DynamoDB

### API Gateway
- Endpoint REST para receber dados via POST

### DynamoDB
- Tabela para armazenar dados processados

### CloudWatch
- Dashboard personalizado com métricas
- Log groups para as funções Lambda

### X-Ray
- Tracing habilitado para Lambda e API Gateway

## Monitoramento

### CloudWatch Dashboard
Acesse o console da AWS → CloudWatch → Dashboards → `aws-monitoring-workshop-dev-monitoring`

### X-Ray Traces
Acesse o console da AWS → X-Ray → Traces

### CloudWatch Logs
Acesse o console da AWS → CloudWatch → Log groups → `/aws/lambda/aws-monitoring-workshop-dev-processData`

## Testando a Aplicação

### Via Script
```bash
./scripts/test-api.sh
```

### Via curl
```bash
curl -X POST https://YOUR-API-ID.execute-api.us-east-1.amazonaws.com/dev/data \
  -H "Content-Type: application/json" \
  -d '{"name": "Test Product", "value": 99.99}'
```

## Limpeza

Para remover todos os recursos:

```bash
npx sls remove
```

## Troubleshooting

### Erro de Permissões
- Verifique se sua conta tem as permissões necessárias
- Confirme se o AWS CLI está configurado corretamente

### Timeout na Função
- Verifique os logs no CloudWatch
- Ajuste o timeout no `serverless.yml` se necessário

### Erro de Deploy
- Confirme se a região está correta
- Verifique se não há conflitos de nomes de recursos