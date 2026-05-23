@echo off
title HireWave Dev Server Launcher
echo 🌊 Starting HireWave Backend and Frontend Servers...
echo.
echo 🔌 [1/2] Launching Backend on http://localhost:5000/
start "HireWave Backend" cmd /k "cd backend && npm run dev"

echo ➜ [2/2] Launching Frontend on http://localhost:5173/
start "HireWave Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo 🎉 Both servers have been launched in separate, persistent windows!
echo ➜ You can access the UI at: http://localhost:5173/
echo.
pause
