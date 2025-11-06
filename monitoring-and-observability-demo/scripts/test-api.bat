@echo off
setlocal enabledelayedexpansion

REM Get API Gateway URL from serverless info
for /f "tokens=2" %%i in ('npx sls info --verbose ^| findstr ServiceEndpoint') do set API_URL=%%i

if "%API_URL%"=="" (
    echo Error: Could not get API URL. Make sure the service is deployed.
    exit /b 1
)

echo Testing API at: %API_URL%
echo ================================

REM Test 1: Valid request
echo Test 1: Creating valid data item...
curl -X POST "%API_URL%/data" -H "Content-Type: application/json" -d "{\"name\": \"Test Product\", \"value\": 99.99}" -w "\nStatus: %%{http_code}\n\n"

REM Test 2: Invalid request (missing name)
echo Test 2: Creating invalid data item (missing name)...
curl -X POST "%API_URL%/data" -H "Content-Type: application/json" -d "{\"value\": 50.00}" -w "\nStatus: %%{http_code}\n\n"

REM Test 3: Invalid request (missing value)
echo Test 3: Creating invalid data item (missing value)...
curl -X POST "%API_URL%/data" -H "Content-Type: application/json" -d "{\"name\": \"Invalid Product\"}" -w "\nStatus: %%{http_code}\n\n"

REM Test 4: Empty body
echo Test 4: Empty request body...
curl -X POST "%API_URL%/data" -H "Content-Type: application/json" -w "\nStatus: %%{http_code}\n\n"

echo Testing completed!
echo Check CloudWatch Logs and X-Ray traces for detailed monitoring data.