#!/bin/bash

# Get API Gateway URL from serverless info
API_URL=$(npx sls info --verbose | grep ServiceEndpoint | awk '{print $2}')

if [ -z "$API_URL" ]; then
    echo "Error: Could not get API URL. Make sure the service is deployed."
    exit 1
fi

echo "Testing API at: $API_URL"
echo "================================"

# Test 1: Valid request
echo "Test 1: Creating valid data item..."
curl -X POST "$API_URL/data" \
  -H "Content-Type: application/json" \
  -d '{"name": "Test Product", "value": 99.99}' \
  -w "\nStatus: %{http_code}\n\n"

# Test 2: Invalid request (missing name)
echo "Test 2: Creating invalid data item (missing name)..."
curl -X POST "$API_URL/data" \
  -H "Content-Type: application/json" \
  -d '{"value": 50.00}' \
  -w "\nStatus: %{http_code}\n\n"

# Test 3: Invalid request (missing value)
echo "Test 3: Creating invalid data item (missing value)..."
curl -X POST "$API_URL/data" \
  -H "Content-Type: application/json" \
  -d '{"name": "Invalid Product"}' \
  -w "\nStatus: %{http_code}\n\n"

# Test 4: Empty body
echo "Test 4: Empty request body..."
curl -X POST "$API_URL/data" \
  -H "Content-Type: application/json" \
  -w "\nStatus: %{http_code}\n\n"

echo "Testing completed!"
echo "Check CloudWatch Logs and X-Ray traces for detailed monitoring data."