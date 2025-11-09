@echo off
title Ollama Screen - Starting...

cd /d "%~dp0"

echo.
echo Starting Ollama Screen...
echo.

REM Check if node_modules exists
if not exist "node_modules" (
    echo Installing dependencies (this may take a few minutes^)...
    call npm install
    echo.
)

echo Starting development server...
echo Opening http://localhost:3000 in your browser...
echo.
echo Press Ctrl+C to stop the server
echo.

REM Open browser after a short delay
timeout /t 3 /nobreak >nul
start "" http://localhost:3000

REM Start the development server
call npm run dev
