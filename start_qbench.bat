@echo off
title Q-Bench Launcher
echo ========================================================
echo   Q-BENCH: Quantum vs Classical ML Benchmarking Platform
echo ========================================================
echo.

cd /d "%~dp0"

echo [1/2] Starting Backend API on http://127.0.0.1:8000 ...
start "Q-Bench Backend API" cmd /k ".\qbench_venv\Scripts\python.exe -m uvicorn q-bench.backend.main:app --host 127.0.0.1 --port 8000"

timeout /t 3 /nobreak >nul

echo [2/2] Starting Frontend Vite on http://localhost:5173 ...
cd q-bench\frontend
start "Q-Bench Frontend" cmd /k "npm.cmd run dev"

echo.
echo ========================================================
echo   Q-Bench is starting up!
echo   Frontend: http://localhost:5173
echo   Backend:  http://127.0.0.1:8000/docs
echo ========================================================
echo.
pause
