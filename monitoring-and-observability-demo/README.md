# AWS Monitoring and Observability Demo

Demonstração completa de observabilidade em aplicações serverless usando AWS X-Ray, CloudWatch Logs, Metrics e Dashboards.

## 🏗️ Arquitetura

```
API Gateway → Lambda → DynamoDB
     ↓
CloudWatch Logs + Metrics + X-Ray Traces + Dashboard
```

- **API**: AWS API Gateway REST
- **Compute**: AWS Lambda (Node.js 18.x + TypeScript)
- **Database**: Amazon DynamoDB
- **Monitoring**: CloudWatch + X-Ray
- **Framework**: Serverless Framework v3

## 📁 Estrutura

```
src/
├── handler.ts        # Handler Lambda principal
└── types.ts         # Definições de tipos TypeScript
scripts/
├── test-api.sh      # Script de teste (Linux/Mac)
└── test-api.bat     # Script de teste (Windows)
examples/
├── test-payload.json    # Payload de exemplo
└── test-requests.http   # Requisições HTTP
docs/
└── SETUP-CONTA-AWS.md  # Documentação de setup
```

## 🚀 Deploy Rápido

### Usando Scripts Automatizados
```bash
# Linux/Mac
./deploy.sh

# Windows
deploy.bat
```

### Deploy Manual
```bash
# Instalar dependências
npm install

# Build TypeScript
npm run build

# Deploy
npx sls deploy
```

## 📡 API Endpoints

### POST /data
Cria um novo item de dados no DynamoDB.

**Request:**
```json
{
  "name": "Test Product",
  "value": 99.99
}
```

**Response:**
```json
{
  "message": "Data processed successfully",
  "item": {
    "id": "1698765432-abc123def",
    "name": "Test Product",
    "value": 99.99,
    "timestamp": "2024-01-15T10:30:00.000Z"
  }
}
```

## 🧪 Testando a Aplicação

### 1. Script Automatizado
```bash
# Linux/Mac
./scripts/test-api.sh

# Windows
scripts\test-api.bat
```

### 2. Teste Manual
```bash
# Obter URL da API
API_URL=$(npx sls info --verbose | grep ServiceEndpoint | awk '{print $2}')

# Teste válido
curl -X POST "$API_URL/data" \
  -H "Content-Type: application/json" \
  -d '{"name": "Test Product", "value": 99.99}'

# Teste inválido (erro de validação)
curl -X POST "$API_URL/data" \
  -H "Content-Type: application/json" \
  -d '{"value": 50.00}'
```

### 3. Usando VS Code REST Client
Abra `examples/test-requests.http` no VS Code com a extensão REST Client.

## 📊 Observabilidade

### 1. CloudWatch Dashboard
**Localização**: AWS Console → CloudWatch → Dashboards → `aws-monitoring-workshop-dev-monitoring`

**Métricas Incluídas**:
- Lambda Duration, Invocations, Errors
- API Gateway Count, Latency, 4XX/5XX Errors

### 2. X-Ray Tracing
**Localização**: AWS Console → X-Ray → Traces

**Recursos**:
- Trace completo da requisição
- Tempo de execução por serviço
- Detalhes de erros e exceções
- Mapa de serviços

### 3. CloudWatch Logs
**Localização**: AWS Console → CloudWatch → Log groups → `/aws/lambda/aws-monitoring-workshop-dev-processData`

**Logs Estruturados**:
```json
{
  "timestamp": "2024-01-15T10:30:00.000Z",
  "level": "INFO",
  "message": "Processing request",
  "requestId": "abc-123-def",
  "data": { "name": "Test Product", "value": 99.99 }
}
```

### 4. Métricas Customizadas
- Annotations no X-Ray para filtros
- Metadata para contexto adicional
- Subsegments para operações específicas

## 🔍 Recursos de Monitoramento

### X-Ray Tracing Habilitado
```yaml
provider:
  tracing:
    lambda: true
    apiGateway: true
```

### Logging Estruturado
```typescript
console.log('Processing request:', JSON.stringify(event, null, 2));
```

### Subsegments Customizados
```typescript
const subsegment = segment?.addNewSubsegment('processData');
subsegment?.addMetadata('item', item);
subsegment?.addAnnotation('operation', 'create');
```

### Dashboard Automático
- Criado via CloudFormation
- Métricas de Lambda e API Gateway
- Visualização em tempo real

## 🚨 Alertas e Monitoramento

### Métricas Importantes
- **Lambda Errors**: Taxa de erro das funções
- **Lambda Duration**: Tempo de execução
- **API Gateway 5XX**: Erros do servidor
- **DynamoDB Throttles**: Limitação de throughput

### Configuração de Alertas (Exemplo)
```yaml
# Adicionar ao serverless.yml
resources:
  Resources:
    HighErrorRateAlarm:
      Type: AWS::CloudWatch::Alarm
      Properties:
        AlarmName: HighLambdaErrorRate
        MetricName: Errors
        Namespace: AWS/Lambda
        Statistic: Sum
        Period: 300
        EvaluationPeriods: 2
        Threshold: 5
        ComparisonOperator: GreaterThanThreshold
```

## 🧹 Limpeza

### Usando Scripts
```bash
# Linux/Mac
./cleanup.sh

# Windows
cleanup.bat
```

### Manual
```bash
npx sls remove
```

## 📚 Conceitos Demonstrados

### 1. **Distributed Tracing**
- Rastreamento de requisições através de múltiplos serviços
- Identificação de gargalos e falhas
- Correlação de logs e métricas

### 2. **Structured Logging**
- Logs em formato JSON
- Campos padronizados (timestamp, level, message)
- Contexto adicional para debugging

### 3. **Custom Metrics**
- Annotations para filtros no X-Ray
- Metadata para contexto detalhado
- Subsegments para operações específicas

### 4. **Dashboards Automáticos**
- Criação via Infrastructure as Code
- Métricas centralizadas
- Visualização em tempo real

### 5. **Error Handling**
- Captura e logging de erros
- Propagação adequada de exceções
- Contexto para troubleshooting

## 🔧 Troubleshooting

### Problemas Comuns

1. **X-Ray não mostra traces**
   - Verificar se tracing está habilitado
   - Confirmar permissões IAM

2. **Dashboard não aparece**
   - Verificar se deploy foi bem-sucedido
   - Confirmar região correta

3. **Logs não aparecem**
   - Verificar grupo de logs no CloudWatch
   - Confirmar função está sendo executada

### Comandos Úteis
```bash
# Ver informações do deploy
npx sls info --verbose

# Logs em tempo real
npx sls logs -f processData -t

# Verificar stack no CloudFormation
aws cloudformation describe-stacks --stack-name aws-monitoring-workshop-dev
```