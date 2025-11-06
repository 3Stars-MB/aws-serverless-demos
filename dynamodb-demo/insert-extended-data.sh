#!/bin/bash

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${YELLOW}🚀 Inserindo dados estendidos no DynamoDB...${NC}"

TABLE_NAME=$(aws cloudformation describe-stacks \
  --stack-name ecommerce-dynamodb-demo-dev \
  --query 'Stacks[0].Outputs[?OutputKey==`ProductsTableName`].OutputValue' \
  --output text 2>/dev/null)

if [ -z "$TABLE_NAME" ]; then
  echo -e "${RED}❌ Erro: Tabela não encontrada. Execute: npm run deploy${NC}"
  exit 1
fi

echo -e "${GREEN}📋 Tabela: $TABLE_NAME${NC}"

# ========== PRODUTOS PRINCIPAIS ==========
echo -e "${BLUE}📦 Inserindo produtos principais...${NC}"

# PRODUCT#001 - Mouse Gamer
aws dynamodb put-item --table-name "$TABLE_NAME" --item '{
  "PK": {"S": "PRODUCT#001"}, "SK": {"S": "METADATA#001"},
  "Name": {"S": "Mouse Gamer RGB"}, "Category": {"S": "Peripherals"},
  "Price": {"N": "199.90"}, "Stock": {"N": "120"}, "Brand": {"S": "Logitech"}
}'

# PRODUCT#002 - Teclado RGB
aws dynamodb put-item --table-name "$TABLE_NAME" --item '{
  "PK": {"S": "PRODUCT#002"}, "SK": {"S": "METADATA#002"},
  "Name": {"S": "Teclado RGB"}, "Category": {"S": "Peripherals"},
  "Price": {"N": "249.90"}, "Stock": {"N": "85"}, "Brand": {"S": "Corsair"}
}'

# PRODUCT#003 - Monitor
aws dynamodb put-item --table-name "$TABLE_NAME" --item '{
  "PK": {"S": "PRODUCT#003"}, "SK": {"S": "METADATA#003"},
  "Name": {"S": "Monitor 27\" 4K"}, "Category": {"S": "Monitors"},
  "Price": {"N": "1299.00"}, "Stock": {"N": "42"}, "Brand": {"S": "Samsung"}
}'

# PRODUCT#004 - Headset
aws dynamodb put-item --table-name "$TABLE_NAME" --item '{
  "PK": {"S": "PRODUCT#004"}, "SK": {"S": "METADATA#004"},
  "Name": {"S": "Headset Gamer 7.1"}, "Category": {"S": "Audio"},
  "Price": {"N": "349.90"}, "Stock": {"N": "67"}, "Brand": {"S": "SteelSeries"}
}'

# PRODUCT#005 - Webcam
aws dynamodb put-item --table-name "$TABLE_NAME" --item '{
  "PK": {"S": "PRODUCT#005"}, "SK": {"S": "METADATA#005"},
  "Name": {"S": "Webcam 4K Pro"}, "Category": {"S": "Video"},
  "Price": {"N": "599.00"}, "Stock": {"N": "23"}, "Brand": {"S": "Logitech"}
}'

# ========== RELACIONAMENTOS CRUZADOS ==========
echo -e "${BLUE}🔗 Inserindo relacionamentos cruzados...${NC}"

# PRODUCT#001 relacionado com outros metadados
aws dynamodb put-item --table-name "$TABLE_NAME" --item '{
  "PK": {"S": "PRODUCT#001"}, "SK": {"S": "METADATA#002"},
  "RelationType": {"S": "Compatible"}, "RelatedProduct": {"S": "PRODUCT#002"},
  "Description": {"S": "Combo perfeito mouse + teclado"}
}'

aws dynamodb put-item --table-name "$TABLE_NAME" --item '{
  "PK": {"S": "PRODUCT#001"}, "SK": {"S": "METADATA#003"},
  "RelationType": {"S": "Recommended"}, "RelatedProduct": {"S": "PRODUCT#003"},
  "Description": {"S": "Setup gamer completo"}
}'

# PRODUCT#002 relacionado com outros metadados
aws dynamodb put-item --table-name "$TABLE_NAME" --item '{
  "PK": {"S": "PRODUCT#002"}, "SK": {"S": "METADATA#001"},
  "RelationType": {"S": "Compatible"}, "RelatedProduct": {"S": "PRODUCT#001"},
  "Description": {"S": "Periféricos sincronizados"}
}'

aws dynamodb put-item --table-name "$TABLE_NAME" --item '{
  "PK": {"S": "PRODUCT#002"}, "SK": {"S": "METADATA#004"},
  "RelationType": {"S": "Bundle"}, "RelatedProduct": {"S": "PRODUCT#004"},
  "Description": {"S": "Kit gamer essencial"}
}'

# PRODUCT#003 relacionado com outros metadados
aws dynamodb put-item --table-name "$TABLE_NAME" --item '{
  "PK": {"S": "PRODUCT#003"}, "SK": {"S": "METADATA#001"},
  "RelationType": {"S": "Recommended"}, "RelatedProduct": {"S": "PRODUCT#001"},
  "Description": {"S": "Monitor + mouse para produtividade"}
}'

aws dynamodb put-item --table-name "$TABLE_NAME" --item '{
  "PK": {"S": "PRODUCT#003"}, "SK": {"S": "METADATA#005"},
  "RelationType": {"S": "Professional"}, "RelatedProduct": {"S": "PRODUCT#005"},
  "Description": {"S": "Setup para streaming"}
}'

# ========== ESPECIFICAÇÕES TÉCNICAS ==========
echo -e "${BLUE}🔧 Inserindo especificações técnicas...${NC}"

# Mouse - Especificações
aws dynamodb put-item --table-name "$TABLE_NAME" --item '{
  "PK": {"S": "PRODUCT#001"}, "SK": {"S": "SPECS#001"},
  "DPI": {"N": "16000"}, "Buttons": {"N": "8"}, "Weight": {"N": "95"},
  "Connectivity": {"S": "Wireless"}, "BatteryLife": {"S": "70h"}
}'

# Teclado - Especificações
aws dynamodb put-item --table-name "$TABLE_NAME" --item '{
  "PK": {"S": "PRODUCT#002"}, "SK": {"S": "SPECS#002"},
  "SwitchType": {"S": "Cherry MX Red"}, "Layout": {"S": "ABNT2"},
  "Backlight": {"S": "RGB"}, "Connectivity": {"S": "USB-C"}
}'

# Monitor - Especificações
aws dynamodb put-item --table-name "$TABLE_NAME" --item '{
  "PK": {"S": "PRODUCT#003"}, "SK": {"S": "SPECS#003"},
  "Resolution": {"S": "3840x2160"}, "RefreshRate": {"N": "144"},
  "PanelType": {"S": "IPS"}, "HDR": {"S": "HDR10"}
}'

echo -e "${GREEN}🎉 Dados estendidos inseridos com sucesso!${NC}"
echo -e "${YELLOW}📊 Padrões demonstrados:${NC}"
echo -e "${GREEN}• Produtos principais (PRODUCT#xxx + METADATA#xxx)${NC}"
echo -e "${GREEN}• Relacionamentos cruzados (PRODUCT#xxx + METADATA#yyy)${NC}"
echo -e "${GREEN}• Especificações técnicas (PRODUCT#xxx + SPECS#xxx)${NC}"

echo -e "${YELLOW}🔍 Exemplo de consulta:${NC}"
echo -e "${BLUE}aws dynamodb query --table-name $TABLE_NAME --key-condition-expression 'PK = :pk' --expression-attribute-values '{\":pk\":{\"S\":\"PRODUCT#001\"}}'${NC}"