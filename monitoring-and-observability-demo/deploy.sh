#!/bin/bash

echo "🚀 Deploying AWS Monitoring Workshop..."
echo "======================================"

# Check if serverless is installed
if ! command -v serverless &> /dev/null; then
    echo "❌ Serverless Framework not found. Installing..."
    npm install -g serverless
fi

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Build TypeScript
echo "🔨 Building TypeScript..."
npm run build

# Deploy to AWS
echo "☁️  Deploying to AWS..."
serverless deploy --verbose

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Deployment successful!"
    echo ""
    echo "📊 Resources created:"
    echo "- Lambda Function: processData"
    echo "- API Gateway: REST API"
    echo "- DynamoDB Table: Data storage"
    echo "- CloudWatch Dashboard: Monitoring"
    echo "- X-Ray Tracing: Enabled"
    echo ""
    echo "🧪 Test the API:"
    echo "./scripts/test-api.sh"
    echo ""
    echo "📈 View monitoring:"
    echo "- CloudWatch Dashboard: AWS Console → CloudWatch → Dashboards"
    echo "- X-Ray Traces: AWS Console → X-Ray → Traces"
    echo "- Lambda Logs: AWS Console → CloudWatch → Log groups"
else
    echo "❌ Deployment failed!"
    exit 1
fi