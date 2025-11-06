#!/bin/bash

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}🚀 Inserindo dados básicos no DynamoDB...${NC}"

TABLE_NAME=$(aws cloudformation describe-stacks \
  --stack-name ecommerce-dynamodb-demo-dev \
  --query 'Stacks[0].Outputs[?OutputKey==`ProductsTableName`].OutputValue' \
  --output text 2>/dev/null)

if [ -z "$TABLE_NAME" ]; then
  echo -e "${RED}❌ Erro: Tabela não encontrada. Execute: npm run deploy${NC}"
  exit 1
fi

echo -e "${GREEN}📋 Tabela: $TABLE_NAME${NC}"

# Produto 1: Mouse Gamer
aws dynamodb put-item --table-name "$TABLE_NAME" --item '{
  "PK": {"S": "PRODUCT#001"},
  "SK": {"S": "METADATA#001"},
  "Name": {"S": "Mouse Gamer RGB"},
  "Category": {"S": "Peripherals"},
  "Price": {"N": "199.90"},
  "Stock": {"N": "120"},
  "Brand": {"S": "Logitech"}
}'

# Produto 2: Teclado RGB
aws dynamodb put-item --table-name "$TABLE_NAME" --item '{
  "PK": {"S": "PRODUCT#002"},
  "SK": {"S": "METADATA#002"},
  "Name": {"S": "Teclado RGB"},
  "Category": {"S": "Peripherals"},
  "Price": {"N": "249.90"},
  "Stock": {"N": "85"},
  "Brand": {"S": "Corsair"}
}'

# Produto 3: Monitor 27"
aws dynamodb put-item --table-name "$TABLE_NAME" --item '{
  "PK": {"S": "PRODUCT#003"},
  "SK": {"S": "METADATA#003"},
  "Name": {"S": "Monitor 27\""},
  "Category": {"S": "Monitors"},
  "Price": {"N": "1299.00"},
  "Stock": {"N": "42"},
  "Brand": {"S": "Samsung"}
}'

echo -e "${GREEN}🎉 Dados básicos inseridos com sucesso!${NC}"

API_URL=$(aws cloudformation describe-stacks \
  --stack-name ecommerce-dynamodb-demo-dev \
  --query 'Stacks[0].Outputs[?OutputKey==`ApiGatewayUrl`].OutputValue' \
  --output text 2>/dev/null)

if [ ! -z "$API_URL" ]; then
  echo -e "${GREEN}📡 Teste: curl $API_URL/products${NC}"
  echo -e "${GREEN}📡 Teste: curl $API_URL/products/001${NC}"
fi