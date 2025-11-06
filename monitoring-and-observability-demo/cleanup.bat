@echo off
echo 🧹 Cleaning up AWS Monitoring Workshop resources...
echo ==================================================

set /p confirm="⚠️  This will delete ALL resources. Are you sure? (y/N): "
if /i not "%confirm%"=="y" (
    echo ❌ Cleanup cancelled.
    exit /b 1
)

echo 🗑️  Removing serverless stack...
serverless remove --verbose

if %errorlevel% equ 0 (
    echo.
    echo ✅ Cleanup successful!
    echo.
    echo 🗑️  Resources removed:
    echo - Lambda Function: processData
    echo - API Gateway: REST API
    echo - DynamoDB Table: Data storage
    echo - CloudWatch Dashboard: Monitoring
    echo - IAM Roles: Lambda execution role
    echo.
    echo ℹ️  Note: CloudWatch Logs may be retained based on retention settings
) else (
    echo ❌ Cleanup failed!
    echo 💡 You may need to manually remove some resources from AWS Console
    exit /b 1
)