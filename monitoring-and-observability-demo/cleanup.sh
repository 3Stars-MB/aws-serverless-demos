#!/bin/bash

echo "🧹 Cleaning up AWS Monitoring Workshop resources..."
echo "=================================================="

# Confirm deletion
read -p "⚠️  This will delete ALL resources. Are you sure? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Cleanup cancelled."
    exit 1
fi

echo "🗑️  Removing serverless stack..."
serverless remove --verbose

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Cleanup successful!"
    echo ""
    echo "🗑️  Resources removed:"
    echo "- Lambda Function: processData"
    echo "- API Gateway: REST API"
    echo "- DynamoDB Table: Data storage"
    echo "- CloudWatch Dashboard: Monitoring"
    echo "- IAM Roles: Lambda execution role"
    echo ""
    echo "ℹ️  Note: CloudWatch Logs may be retained based on retention settings"
else
    echo "❌ Cleanup failed!"
    echo "💡 You may need to manually remove some resources from AWS Console"
    exit 1
fi