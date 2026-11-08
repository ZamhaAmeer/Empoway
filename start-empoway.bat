@echo off
title EMPOWAY - Empowering Every Journey
echo ========================================================
echo   EMPOWAY Accessibility Platform - Starting Services
echo ========================================================
echo.
echo 1. Starting EMPOWAY Backend Server (Port 5000)...
start "EMPOWAY Backend (Port 5000)" cmd /k "cd /d \"%~dp0server\" && node server.js"

echo 2. Starting EMPOWAY Frontend Client (Port 5173)...
start "EMPOWAY Frontend (Port 5173)" cmd /k "cd /d \"%~dp0client\" && npm run dev"

echo.
echo Waiting 4 seconds for servers to initialize...
timeout /t 4 /nobreak >nul

echo 3. Opening EMPOWAY in your web browser...
start http://localhost:5173

echo.
echo ========================================================
echo   EMPOWAY is now running!
echo   - Web App: http://localhost:5173
echo   - Backend: http://localhost:5000
echo   Keep the server terminal windows open while browsing.
echo ========================================================

