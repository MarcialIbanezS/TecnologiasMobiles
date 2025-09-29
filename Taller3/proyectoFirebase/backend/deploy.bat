@echo off
REM Deployment script for backend on Windows

echo 🚀 Starting backend deployment...

REM Check if .env file exists
if not exist .env (
    echo ❌ Error: .env file not found!
    echo Please copy .env.example to .env and configure your database settings
    exit /b 1
)

REM Install dependencies
echo 📦 Installing dependencies...
call npm install

REM Test database connection
echo 🔍 Testing database connection...
node -e "const { testConnection } = require('./database'); testConnection().then(success => { if (!success) { console.log('❌ Database connection failed. Please check your .env configuration.'); process.exit(1); } console.log('✅ Database connection successful!'); });"

if %errorlevel% neq 0 (
    echo ❌ Deployment failed: Database connection test failed
    exit /b 1
)

REM Start the server
echo 🎉 Deployment successful! Starting server...
call npm start