# Lambda Best Practices Demo

Demonstração de melhores práticas para desenvolvimento de funções AWS Lambda com processamento de eventos S3 e notificações SNS.

## 🏗️ Arquitetura

```
S3 Bucket → Lambda Function → SNS Topic
```

- **Trigger**: S3 Event (ObjectCreated:Put)
- **Processing**: AWS Lambda (Node.js 20.x)
- **Notification**: Amazon SNS
- **Framework**: Serverless Framework v4

## 📁 Estrutura

```
src/
└── index.js          # Handler Lambda principal
```

## 🚀 Configuração e Deploy

### Pré-requisitos
- AWS CLI configurado
- Node.js 20+ instalado
- Serverless Framework

### Instalação
```bash
# Instalar dependências
npm install

# Configurar ambiente
cp .env.example .env
# Editar .env com seu SNS Topic ARN

# Deploy
npx sls deploy
```

### Variáveis de Ambiente
```bash
SNS_TOPIC_ARN=arn:aws:sns:REGION:ACCOUNT_ID:TOPIC_NAME
```

## 🧪 Como Testar

### 1. Teste Local
```bash
# Criar evento de teste
echo '{
  "Records": [{
    "s3": {
      "bucket": { "name": "paraty-demo" },
      "object": { "key": "test-file.txt" }
    }
  }]
}' > test-event.json

# Executar teste local
npx sls invoke local -f processS3Object -p test-event.json
```

### 2. Teste End-to-End
```bash
# Upload arquivo para S3
echo "Conteúdo de teste" > test.txt
aws s3 cp test.txt s3://paraty-demo/

# Verificar logs
npx sls logs -f processS3Object -t
```

### 3. Cenários de Teste
```bash
# Arquivo com caracteres especiais
echo "teste" > "arquivo com espaços.txt"
aws s3 cp "arquivo com espaços.txt" s3://paraty-demo/

# Arquivo maior (100KB)
dd if=/dev/zero of=large.txt bs=1024 count=100
aws s3 cp large.txt s3://paraty-demo/
```

## 📊 Funcionalidades

### Processamento de Arquivos S3
- Leitura automática de arquivos enviados ao bucket
- Decodificação de nomes com caracteres especiais
- Conversão de stream para string

### Notificações SNS
- Envio automático de notificação
- Inclusão do conteúdo do arquivo na mensagem
- Tratamento de erros robusto

### Melhores Práticas Implementadas

#### 1. **Tratamento de Erros**
```javascript
try {
  // Processamento
} catch (error) {
  console.error("Erro ao processar:", error);
  throw new Error(`Falha: ${error.message}`);
}
```

#### 2. **Logging Estruturado**
```javascript
console.log("Evento recebido:", JSON.stringify(event, null, 2));
console.log(`Notificação enviada para SNS (${process.env.SNS_TOPIC_ARN})`);
```

#### 3. **Uso do AWS SDK v3**
```javascript
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";
```

#### 4. **Processamento de Streams**
```javascript
async function streamToString(stream) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stream.on("data", (chunk) => chunks.push(chunk));
    stream.on("error", reject);
    stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf-8")));
  });
}
```

## 🔧 Monitoramento

### Logs
```bash
# Logs em tempo real
npx sls logs -f processS3Object -t

# Logs com filtro de erro
npx sls logs -f processS3Object --filter "ERROR"
```

### Métricas CloudWatch
- Invocations
- Duration
- Errors
- Throttles

## 🧹 Limpeza

```bash
npx sls remove
```

## 📚 Conceitos Demonstrados

- **Event-Driven Architecture**: Processamento baseado em eventos S3
- **Serverless Computing**: Execução sob demanda sem gerenciamento de servidor
- **AWS SDK v3**: Uso da versão mais recente com imports modulares
- **Stream Processing**: Manipulação eficiente de arquivos grandes
- **Error Handling**: Tratamento robusto de erros e logging
- **Environment Variables**: Configuração externa segura