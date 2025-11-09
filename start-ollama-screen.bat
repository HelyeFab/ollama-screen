@echo off
title Ollama Screen - Starting...

cd /d "%~dp0"

echo.
echo 🚀 Starting Ollama Screen...
echo.

REM Check if node_modules exists
if not exist "node_modules" (
    echo 📦 Installing dependencies (this may take a few minutes)...
    call npm install
    echo.
)

REM Check if Ollama server is running
curl -s http://localhost:11434/api/tags >nul 2>&1
if errorlevel 1 (
    echo ⚠️  Warning: Ollama server doesn't seem to be running!
    echo    You may need to start Ollama first.
    echo.
)

echo 🌐 Starting development server...
echo    Opening http://localhost:3000 in your browser...
echo.
echo    Press Ctrl+C to stop the server
echo.

REM Wait a moment then open browser
start "" http://localhost:3000

REM Start the development server
call npm run dev
