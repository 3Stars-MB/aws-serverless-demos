@echo off
echo 🚀 Deploying AWS Monitoring Workshop...
echo ======================================

REM Check if dependencies are installed
if not exist "node_modules" (
    echo 📦 Installing dependencies...
    npm install
)

REM Build TypeScript
echo 🔨 Building TypeScript...
npm run build

REM Deploy to AWS
echo ☁️  Deploying to AWS...
serverless deploy --verbose

if %errorlevel% equ 0 (
    echo.
    echo ✅ Deployment successful!
    echo.
    echo 📊 Resources created:
    echo - Lambda Function: processData
    echo - API Gateway: REST API
    echo - DynamoDB Table: Data storage
    echo - CloudWatch Dashboard: Monitoring
    echo - X-Ray Tracing: Enabled
    echo.
    echo 🧪 Test the API:
    echo scripts\test-api.bat
    echo.
    echo 📈 View monitoring:
    echo - CloudWatch Dashboard: AWS Console → CloudWatch → Dashboards
    echo - X-Ray Traces: AWS Console → X-Ray → Traces
    echo - Lambda Logs: AWS Console → CloudWatch → Log groups
) else (
    echo ❌ Deployment failed!
    exit /b 1
)